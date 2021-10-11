import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user',
    templateUrl: './user.page.html',
    styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
    userData = null
    newpassword: any

    constructor(
        private apiService: ApiService,
        private alertController: AlertController,
        private router: Router,
        private loadingController: LoadingController,
        ) { }

    async ngOnInit() {
        this.userData = this.apiService.userdata
    }

    async ionViewWillEnter(){
        this.userData = this.apiService.userdata
    }

    async logout() {
        const loading = await this.loadingController.create()
        await loading.present()

        const data = await this.apiService.logout()

        await loading.dismiss()
        this.router.navigateByUrl("/login")
    }
}
