import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
    userData = null
    newpassword: any
    darkMode = false

    constructor(
        private apiService: ApiService,
        private alertController: AlertController,
        private router: Router,
        private loadingController: LoadingController,
        private settingsService: SettingsService
        ) { }

    async ngOnInit() {
        this.userData = this.apiService.userdata
        this.darkMode = this.settingsService.darkMode
    }

    async ionViewWillEnter(){
        this.userData = this.apiService.userdata
        this.darkMode = this.settingsService.darkMode
    }

    changeDarkMode(e){
        this.settingsService.setDarkMode(e.detail.checked)
    }

    async logout() {
        const loading = await this.loadingController.create()
        await loading.present()

        const data = await this.apiService.logout()

        await loading.dismiss()
        this.router.navigateByUrl("/login")
    }
}
