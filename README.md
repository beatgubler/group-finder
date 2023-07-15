# group-finder

This is a react app to connect with groups and find new peers. Features a supabase database and netlify backend with functions to send mails via mailgun.

Feel free to leave your suggestions, problems, safety concerns or questions in the respected section here on Github.

[![Netlify Status](https://api.netlify.com/api/v1/badges/8844f02e-606e-4fc1-bbbf-7788d4227782/deploy-status)]

## Features:

- responsive mobile first design
- form validation
- styling with tailwind
- local authentication
- persistent login
- send messages to group owners

#### Livepreview: [https://group-finder.gubler-it.com//](https://group-finder.gubler-it.com/)

Now optimized for React 18!

![group-finder [Preview]](https://i.imgur.com/G7s2oa9.png)

## Installation

TBD

- Install NodeJS -> https://nodejs.org/en/download/
- Clone this project with **git clone https://github.com/beatgubler/osbapp.io.git** or download manually
  **npm install** -> **ng serve**

## local environment variables

### supabase

- VITE_SUPABASE_URL=string
- VITE_SUPABASE_KEY=string
- VITE_SUPABASE_SERVICEROLE=string

### mailgun

- MAILGUN_API_URL=string
- MAILGUN_API_KEY=string

### hcaptcha

- VITE_HCAPTCHA_KEY=string

## Notable external dependencies

- @hcaptcha/react-hcaptcha
- @supabase/supabase-js
- @netlify/functions
- react-router-dom
- react-icons
- react-redux
- formik
- mailgun.js
- yup
- tailwind
- vite

## Known issues/concerns
