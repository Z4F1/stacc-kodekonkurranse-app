import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

    private prefersDark: any
    public darkMode: boolean
    public standardCurrency: string

    constructor() {}

    async loadSettings(){
        this.loadDarkTheme()
        this.loadStandardCurrency()
    }

    async loadDarkTheme(){
        const darkMode = await Storage.get({ key: "darkMode"})
        this.prefersDark = window.matchMedia("(prefers-color-scheme: dark)")

        this.prefersDark.addListener(async (e) => {
            this.setDarkTheme(e.matches)
            await Storage.remove({key: "darkMode"})
        })

        if(darkMode && darkMode.value != null){
            this.setDarkTheme((darkMode.value == "true"))
        }else {
            this.setDarkTheme(this.prefersDark.matches)
        }
    }

    async loadStandardCurrency(){
        const currency = await Storage.get({ key: "standardCurrency"})
        if(currency && currency.value != null){
            this.standardCurrency = currency.value
        }else {
            await this.setStandardCurrency("wei")
        }
    }

    setDarkTheme(val){
        let d = document.body.classList.toggle("dark", val)
        console.log(typeof val)
        this.darkMode = val
    }

    async setDarkMode(val){
        await Storage.set({ key: "darkMode", value: val})
        this.setDarkTheme(val)
    }

    async setStandardCurrency(val){
        this.standardCurrency = val
        await Storage.set({ key: "standardCurrency", value: val})
    }
}
