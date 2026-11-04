# Hair n' There website 

	[hairnthere.com](http://hairnthere.com)	

## Digital business card outline

* Instagram page/link/card front and center. Maybe we can load the top 100 instagram posts in a gallery/showcase space that is scrollable

* Pricing  
  * "Get a quote" flow. For example, maybe a family of 9 wants to bundle their haircuts at home on a Saturday. Include the number of haircuts, colors, (list other services provided, and the price per person) so the parents can get an idea of pricing right on the website

  * Automatic calculation of transportation/convenience fee depending on house-call address.   
    * How do we want to do this?   
      * \$1 per min of driving required to reach destination from Suncrest (one-way or round-trip?)
      * Some other calculation or flat transportation/convenience fee depending on the county/city that Elisabeth is willing to drive to?  
    * Probably waive the transportation fee for Suncrest clients. Maybe even for draper/highland/lehi as well.

  * Maybe after getting a quote, a user can click a button to get in contact with Elisabeth.  
    * This would send a discord webhook to an AI agent or Elisabeth for follow up, similar to sunshineflowerbar.com

* CONTACT INFORMATION  
  * Business cell phone number?   
    * Risky to put this on the open internet. You will get spam calls.  
  * **Contact through instagram**?  
  * Telegram?  
  * Whatsapp?  
  * Facebook messenger?  
  * **Get physical business cards for door-to-door or mailboxes**.  
    * Photo of Elisbeth  
    * QR code for the website  
    * QR code for instagram? \- Feels redundant to Harry  
    * Contact info for Elisabeth, including phone number  
    * Anything else needed for the physical business card?  
      

#  Technical details

* Nextjs docker container  
* [hairnthere.com](http://hairnthere.com)  
* Deployed via cloudflare workers or cloudflare's platform  
* SSR best practices observed  
* SEO best practices observed  
* [sitemap.ts](http://sitemap.ts) following nextjs pattern  
* Follow [sunshineflowerbar.com](http://sunshineflowerbar.com) and its pattern of contact form with a discord webhook as the form submission. [https\://github.com/harryt04/flowers](https://github.com/harryt04/flowers)  
* Shadcn UI components where possible  
  * The page should feel like Vercel designed it, in terms of mastery usage of shadcn UI components. Obviously Elisabeth's Hairdresser artistic vision is a first and foremost priority, but wherever we don't have to reinvent the wheel and we can just use shadcn UI components, that is desirable.   
* One-time process to port instagram posts to new account from old account