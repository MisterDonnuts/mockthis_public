import { writable } from 'svelte/store'
import { browser } from '$app/environment'

export const theme = writable<string>(browser && localStorage.getItem('theme') === 'light' ? 'light' : 'dark')

if(browser) {
    console.log(localStorage.getItem('theme'));
    theme.subscribe((value) => {console.log(value);localStorage.setItem('theme', value)})
}