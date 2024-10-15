// Copyright (C) 2024 Enveng Group - Adrian Gallo, Rohan Lonkar and Rhett Bachoup
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import puppeteer from 'puppeteer';

describe('User Flow', () => {
    let browser;
    let page;
    
    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });
    
    afterAll(async () => {
        await browser.close();
    });
    
    it('should navigate to the home page and perform actions', async () => {
        await page.goto('http://localhost:3000');
        await page.click('button#start');
        const text = await page.$eval('h1', (el) => el.textContent);
        expect(text).toBe('Welcome');
    });
    
    it('should fill out and submit a form', async () => {
        await page.goto('http://localhost:3000/form');
        await page.type('input#name', 'John Doe');
        await page.type('input#email', 'john.doe@example.com');
        await page.click('button#submit');
        const confirmationText = await page.$eval('p.confirmation', (el) => el.textContent);
        
        expect(confirmationText).toBe('Form submitted successfully');
    });
    
    it('should navigate to a different page and verify content', async () => {
        await page.goto('http://localhost:3000/another-page');
        const pageTitle = await page.title();
        expect(pageTitle).toBe('Another Page');
        const contentText = await page.$eval('div.content', (el) => el.textContent);
        expect(contentText).toContain('This is another page');
    });
    
    it('should log in successfully', async () => {
        await page.goto('http://localhost:3000/login');
        await page.type('input#username', 'testuser');
        await page.type('input#password', 'password123');
        await page.click('button#login');
        const loginMessage = await page.$eval('p.login-message', (el) => el.textContent);
        
        expect(loginMessage).toBe('Login successful');
    });
    
    it('should navigate using the menu', async () => {
        await page.goto('http://localhost:3000');
        await page.click('nav a#about');
        const aboutText = await page.$eval('h1', (el) => el.textContent);
        expect(aboutText).toBe('About Us');
    });
    
    it('should display error message on form submission failure', async () => {
        await page.goto('http://localhost:3000/form');
        await page.type('input#name', 'John Doe');
        await page.type('input#email', 'invalid-email');
        await page.click('button#submit');
        const errorMessage = await page.$eval('p.error-message', (el) => el.textContent);
        
        expect(errorMessage).toBe('Invalid email address');
    });
});
