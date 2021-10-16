import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
    userData = null

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
