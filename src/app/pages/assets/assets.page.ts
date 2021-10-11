import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, AlertController, IonContent, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AssetPage } from 'src/app/modal/asset/asset.page';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.page.html',
  styleUrls: ['./assets.page.scss'],
})
export class AssetsPage implements OnInit {

    @ViewChild(IonContent, {static: false}) content: IonContent

    sortingOptions: any = {
        header: "Sorting"
    }

    page = 0
    assets = []
    sorting = "desc"
    sortby = "sale_date"

    constructor(
        private loadingController: LoadingController,
        private apiService: ApiService,
        private alertController: AlertController,
        private modalController: ModalController
    ) { }

    async ngOnInit() {
        await this.getAssets()
    }

    async sortbyChanged(event){
        this.sortby = event.detail.value
        await this.updatePage(0)
    }

    async sortingChanged(event){
        this.sorting = event.detail.value
        await this.updatePage(0)
    }

    async getAssets(){
        const loading = await this.loadingController.create({
            message: "Loading assets..."
        })
        await loading.present()

        try {
            const data = await this.apiService.getAssets(this.page, this.sortby, this.sorting)
            this.assets = []
            for(let i = 0; i < 20; i++){
                if(data[i] != null && data[i].image_url != null && data[i].name != null){
                    this.assets.push(data[i])
                }
            }

            await loading.dismiss()

        } catch (error) {
            console.log(error)
            await loading.dismiss()
            const alert = await this.alertController.create({
                header: "Something went wrong",
                message: error.message,
                buttons: ["OK"]
            })
            await alert.present();
        }
    }

    async updatePage(change: number){
        this.page += change
        await this.getAssets()
        this.content.scrollToTop(1000)
    }

    async openDetailView(address: string, id: string){
        const loading = await this.loadingController.create({
            message: "Loading asset..."
        })
        await loading.present()
        try {
            const assetData = await this.apiService.getAsset(address, id)
            console.log(assetData)
            await loading.dismiss()
            
            const modal = await this.modalController.create({
                component: AssetPage,
                componentProps: {
                    "address": address,
                    "id": id,
                    "asset": assetData
                }
            })
            return await modal.present()
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
}
