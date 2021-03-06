import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AssetPage } from 'src/app/modal/asset/asset.page';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-bids',
  templateUrl: './bids.page.html',
  styleUrls: ['./bids.page.scss'],
})
export class BidsPage implements OnInit {

    bids = []
    currency = "wei"

    constructor(
        private apiService: ApiService,
        private modalController: ModalController,
        private loadingController: LoadingController,
        private alertController: AlertController,
        private settingsService: SettingsService
    ) { }

    async ngOnInit() {}

    async ionViewWillEnter(){
        await this.getBids()
        this.currency = this.settingsService.standardCurrency
    }

    async getBids() {
        const loading = await this.loadingController.create({
            message: "Loading your bids..."
        })
        await loading.present()

        try {
            const bids: any = await this.apiService.getUserBids()

            bids.sort((a, b) => {
                return b.amount-a.amount
            })

            for (let bid of bids){
                if(!this.bids.some(b => (b.token_id == bid.token_id && b.contract_address == bid.contract_address))){
                    let d = new Date(bid.createdAt)
                    bid.createdAtString = d.toLocaleString()
                    this.bids.push(bid)
                }
            }

            this.bids.sort((a, b) => {
                a = new Date(a.createdAt)
                b = new Date(b.createdAt)
                return b.getTime() - a.getTime()
            })
            
            await loading.dismiss()
        } catch (error) {
            await loading.dismiss()
            const alert = await this.alertController.create({
                header: "Something went wrong",
                message: error.message,
                buttons: ["OK"]
            })
            await alert.present()
        }
    }

    async openDetailView(address, id){
        const modal = await this.modalController.create({
            component: AssetPage,
            componentProps: {
                "address": address,
                "id": id
            }
        })
        return await modal.present()
    }

}