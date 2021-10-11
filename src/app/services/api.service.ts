import { environment } from "./../../environments/environment"
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

    isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null)
    currentToken = null;
    url = environment.api_url
    secretkey = environment.secret_key

    userdata = null
    
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadToken()
    }
    //6e213345441563d48a31b769e1d63466
    async loadToken() {
        const token = await Storage.get({key: "jwt"})
        if(token && token.value){
            this.http.get(this.url + "/verify", {
                headers: new HttpHeaders({
                "x-token": token.value,
                "api-key": this.secretkey
                })
            }).subscribe(
                data => {
                    if(data){
                        this.currentToken = token.value
                        this.isAuthenticated.next(true)
                        this.getData()
                    }else {
                        this.isAuthenticated.next(false)
                    }
                },
                error => {
                    console.log(error)
                    this.isAuthenticated.next(false)
                }
            )
        }else {
            this.isAuthenticated.next(false)
        }
    }

    async getData(){
        this.http.get(this.url + "/users/", {
            headers: new HttpHeaders({
                "x-token": this.currentToken,
                "api-key":this.secretkey
            })
        }).subscribe(
            data => {
                this.userdata = data
            },
            err => {
                console.log(err)
            }
        )
    }

    async login(credentials: {username, password}) {
        return new Promise((resolve, reject) => {
            this.http.post(this.url + "/users/login", credentials, {
                headers: new HttpHeaders({
                    "api-key": this.secretkey
                })
            }).subscribe(async data => {
                Storage.set({key: "jwt", value: data.toString()})
                
                await this.loadToken()
                
                resolve(data)
            }, err => {
                this.errorHandler(err.error, reject)
            })
        })
    }

    async signup(credentials: {username, password}){
        return new Promise((resolve, reject) => {
            this.http.post(this.url + "/users/", credentials, {
                headers: new HttpHeaders({
                    "api-key": this.secretkey
                })
            }).subscribe(async d => {
                try {
                    const data = await this.login(credentials)

                    resolve(data)
                } catch (error) {
                    throw error
                }
            }, err => {
                reject(err)
            })
        })
    }

    async logout(){
        const delToken = await Storage.remove({key: "jwt"})
        this.currentToken = null
        this.isAuthenticated.next(false)
        return delToken
    }

    async getAssets(page: number, sortby: string, order: string){
        return new Promise((resolve, reject) => {
            let offset = page * 20
            this.http.get(this.url + "/assets/" + offset + "/sort/" + sortby + "/order/" + order, {
                headers: new HttpHeaders({
                    "api-key": this.secretkey,
                    "x-token": this.currentToken
                })
            }).subscribe(data => {
                resolve(data)
            }, err => {
                this.errorHandler(err.error, reject)
            })
        })
    }

    async getAsset(address: string, id: string){
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "/assets/" + address + "/id/" + id, {
                headers: new HttpHeaders({
                    "api-key": this.secretkey,
                    "x-token": this.currentToken
                })
            }).subscribe(data => {
                resolve(data)
            }, err => {
                this.errorHandler(err.error, reject)
            })
        })
    }

    async getBids(address: string, id: string){
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "/bids/" + address + "/id/" + id, {
                headers: new HttpHeaders({
                    "api-key": this.secretkey,
                    "x-token": this.currentToken
                })
            }).subscribe(data => {
                resolve(data)
            }, err => {
                this.errorHandler(err.error, reject)
            })
        })
    }

    async getUserBids(){
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "/bids/user", {
                headers: new HttpHeaders({
                    "api-key": this.secretkey,
                    "x-token": this.currentToken
                })
            }).subscribe(data => {
                resolve(data)
            }, err => {
                this.errorHandler(err.error, reject)
            })
        })
    }

    async postBid(bidData: {contract_address, token_id, amount}){
        return new Promise((resolve, reject) => {
            this.http.post(this.url + "/bids/", bidData, {
                headers: new HttpHeaders({
                    "api-key": this.secretkey,
                    "x-token": this.currentToken
                })
            }).subscribe(data => {
                resolve(data)
            }, err => {
                this.errorHandler(err.error, reject)
            })
        })
    }

    errorHandler(err, callback){
        if(err.message == "Not authorized."){
            this.currentToken = null
            this.isAuthenticated.next(false)
            this.router.navigateByUrl("/login")
        }

        callback(err)
    }
}
