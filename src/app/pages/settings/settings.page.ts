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
    standardCurrency = "wei"

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
        this.standardCurrency = this.settingsService.standardCurrency
    }

    async ionViewWillEnter(){
        this.userData = this.apiService.userdata
        this.darkMode = this.settingsService.darkMode
        this.standardCurrency = this.settingsService.standardCurrency
    }

    changeDarkMode(e){
        this.settingsService.setDarkMode(e.detail.checked)
    }

    changeStandardCurrency(e){
        this.settingsService.setStandardCurrency(e.detail.value)
    }

    async logout() {
        const confirm = await this.alertController.create({
            header: "Confirm logging out!",
            message: "Are you sure you want to log out?",
            buttons: [
                {
                    text: "Cancel",
                    role: "cancel"
                },
                {
                    text: "Logout",
                    cssClass: "danger",
                    handler: async () => {
                        const loading = await this.loadingController.create()
                        await loading.present()
                
                        const data = await this.apiService.logout()
                
                        await loading.dismiss()
                        this.router.navigateByUrl("/login")
                    }
                }
            ]
        })

        await confirm.present()
    }
}
