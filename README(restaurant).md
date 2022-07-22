# Find-Restaurant
![Index page about Restaurant List](./public/Find-Restaurant.png)

A restaurant Demo web application for users that can use this website to search all the foods  around the restaurant location of Demo website 
If you are interested in above please try it to discover which do you like !!!

## Features
- Users can see all restaurants and their information on the homepage
   * picture
   * nane
   * category
   * rating
   
- Users can click any they interested trestaurant to view the more detailed information 
  * location
  * phone
  * description

### Searching
- Type the title of the restaurants in Searc bar
- You can search restaurants by its English name or Chinese name or category of food contry
- Using alert function to remind user whose searching situation whether meets the expection by download 
```bash
npm i alert-node 
```
on derminal. 
For example if user inputs nothing web will alert 'please try again' or if user inputs incorrect keyword web will alert 'there is notiong to match keyword' etc...

### Technology
- JSON-API -> Listing restaurants by use 'JSON'(restaurant api)
- template engine -> Using template engine to covert files from html-like to html for browser
