<!-- ---
title: 'CHM API Server'
disqus: hackmd
---
 -->
# Children Health Monitoring - API Server

This project is our Graduation Thesis, our team built a system that supports parents to monitor their children’s development process since they were born. This system contains several tracking features such as height & weight standard tracking graph, baby-teeth tracking, vaccination process & notification,… Besides that, this website also provides a library of baby’s daily menu, tips for child caring,…  
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)![Cloudinary](https://cloudinary-res.cloudinary.com/image/upload/dpr_2.0,c_scale,f_auto,q_auto,w_50/cloudinary_logo_for_white_bg.svg)![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)![Facebook](https://img.shields.io/badge/Facebook-%231877F2.svg?style=for-the-badge&logo=Facebook&logoColor=white)





## Table of Contents
1. [Demo](#Demo)
2. [Technologies](#Technologies)
3. [Logic Flow](#logic-flow) 

Demo <a name = "Demo"></a>
---


https://user-images.githubusercontent.com/41388666/165593480-b1ba15e1-7b61-4425-a700-faf6b6151be9.mp4

<!-- Usage <a name = "Usage"></a>
--- -->

Technologies <a name = "Technologies"></a>
---
- Environment:  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) + ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- Database:![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
- Hosting: ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)+ ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase) + freemysqlhosting.net




|                          Features                          | Packages/ Techs |
|:-----------------------------------------------------------|:--------------- |
|Local, Facebook and Google Account Authentication  |PassportJS|
|Authorization with JSON Web Token (JWT) secured by cookie & HTTP only (allow cross-domain access with cors) |JWT, CORS, Cookie       |
|Email creating and sending|Nodemailer|
|password hashing and comparing|bcryptjs|
|Images uploading and hosting|express-fileupload, Clouldinary|
|Full Text-search for patterns searching|MySql8.0|


Logic flows <a name = "logic-flow"></a>
---
Below are some of the main flows in the system

**User Authentication / Authenticator with JWT and Cookie**  
    ![](https://i.imgur.com/1PkLXEy.png)  
**Add new vacine event to track**  
    ![](https://i.imgur.com/bhblHJa.png)  
**Update a vaccine event**  
    <img src = "https://i.imgur.com/KBozTIJ.png"/>  




###### tags: `nodejs` `children-health-monitoring`
