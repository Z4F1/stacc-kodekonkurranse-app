import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.page.html',
  styleUrls: ['./asset.page.scss'],
})
export class AssetPage implements OnInit {

    @Input() address: string
    @Input() id: string

    bidData: FormGroup
    asset: any = {}
    bids = []

    constructor(
        private apiService: ApiService,
        private loadingController: LoadingController,
        private alertController: AlertController,
        private modalController: ModalController,
        private fb: FormBuilder
    ) {}

    async ngOnInit() {
        this.bidData = this.fb.group({
            name: [],
            contract_address: [],
            token_id:[],
            amount: new FormControl(0, [Validators.required, Validators.min(0.0001)])
        })


        const loading = await this.loadingController.create({
            message: "Loading asset..."
        })
        await loading.present()
        
        try {
            const data = await this.apiService.getAsset(this.address, this.id)

            await loading.dismiss()
            this.asset = data

            await this.loadBids()
        } catch (error) {
            console.log(error)
            await loading.dismiss()
            const alert = await this.alertController.create({
                header: "Something went wrong",
                message: error.message,
                buttons: ["OK"]
            })
            await alert.present()
        }
    }

    async loadBids() {
        const loading = await this.loadingController.create({
            message: "Loading bids..."
        })
        await loading.present()

        try {
            const bids: any = await this.apiService.getBids(this.address, this.id)

            await loading.dismiss()
            this.bids = []
            for(let bid of bids){
                bid.isuser = (bid.user_id == this.apiService.userdata._id)
                this.bids.push(bid)
            }
            this.bids.sort((a, b) => {
                return b.amount-a.amount
            })
        } catch (error) {
            console.log(error)
            await loading.dismiss()
            const alert = await this.alertController.create({
                header: "Something went wrong",
                message: error.message,
                buttons: ["OK"]
            })
            await alert.present()
        }
    }

    async placeBid(){
        const loading = await this.loadingController.create({
            message:"Trying to place your bid..."
        })
        await loading.present()

        try {
            if(this.bidData.dirty && this.bidData.valid){
                this.bidData.controls["name"].setValue(this.asset.name)
                this.bidData.controls["contract_address"].setValue(this.address)
                this.bidData.controls["token_id"].setValue(this.id)
            }else {
                throw new Error("Not a valid input")
            }

            const bidEntry = await this.apiService.postBid(this.bidData.value)

            await loading.dismiss()

            await this.loadBids()
        } catch (error) {
            console.log(error)
            await loading.dismiss()
            const alert = await this.alertController.create({
                header: "Failed to place bid.",
                message: error.message,
                buttons: ["OK"]
            })
            await alert.present();
        }
    }

    closeModal(){
        this.modalController.dismiss()
    }
}
