    import { Component, OnInit } from '@angular/core';
    import { Validators, FormBuilder, FormGroup } from '@angular/forms';
    import { ApiService } from '../services/api.service';
    import { Router } from '@angular/router';
    import { LoadingController, AlertController } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    credentials: FormGroup

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService, 
        private alertController: AlertController,
        private router: Router,
        private loadingController: LoadingController
        ) { }

    ngOnInit() {
        this.credentials = this.fb.group({
            username: ["", Validators.required],
            password: ["", Validators.required]
        })
    }

    async login() {
        const loading = await this.loadingController.create({
            message: "Trying to log you inn..."
        })
        await loading.present()

        try {
            await this.apiService.login(this.credentials.value)
            
            await loading.dismiss()
            this.router.navigateByUrl("/")
        } catch (error) {
            console.log(error)
            await loading.dismiss()
            const alert = await this.alertController.create({
                header: "Login failed",
                message: error.message,
                buttons: ["OK"]
            })
            await alert.present();
        }
    }

    async signup(){

    }

}
