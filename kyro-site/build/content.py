# -*- coding: utf-8 -*-
"""All page content for kyromarketing.net. Edit here, then run: python3 build/build.py"""

SITE = {
    "name": "Kyro Marketing",
    "url": "https://kyromarketing.net",
    "email": "kyro.marketing@outlook.com",
    "facebook": "https://www.facebook.com/kyromarketing.au",
    "instagram": "https://www.instagram.com/kyro_marketing",
    "ga": "G-RB5BGNSFRM",
    "web3forms_key": "0e957f26-e483-4522-9b04-6cbe7c51f70a",
    "lastmod": "2026-11-20",
    "stats": {"clients": "13+", "roas": "5×", "revenue": "$35K+"},
}

# --------------------------------------------------------------------------- services
SERVICES = [
    dict(slug="meta-ads", title="Meta Ads", tag="Facebook & Instagram", icon="meta",
         short="Turn ad spend into calls, messages and bookings from car owners near you who are ready to book a detail, tint, ceramic coating, PPF or headlight restoration.",
         h1="Meta ads for automotive businesses",
         meta="Facebook and Instagram ads for car detailing, tinting, ceramic coating, PPF and headlight restoration businesses. Built to bring in calls, messages and bookings.",
         overview="Facebook and Instagram put your workshop in front of local car owners while they scroll. We build campaigns for detailing, washing, tinting, ceramic coating, PPF and headlight restoration businesses that bring in real enquiries, not just likes.",
         different=["Campaigns built to drive calls, messages and bookings, not vanity metrics","One offer per campaign, such as a ceramic coating package or a tint quote","Retargeting for people who watched your work but didn't enquire yet"],
         process=["Pick the services with the best margin and build one clear offer for each","Launch ads aimed at car owners in your suburbs with tracking from day one","Move budget toward the ads that generate enquiries","Add retargeting to win back warm leads"],
         benefits=["A steadier flow of enquiries from your local area","Clear numbers on what your ad spend is generating","Reach car owners you'd never meet through word of mouth alone"],
         faq=[("How much should an automotive business spend on Meta ads?","Most clients start between $500 and $3,000 a month in ad spend. The right figure depends on your area, your services and how many jobs you can take on."),
              ("Do Meta ads bring phone calls or messages?","Both are possible. We set each campaign to the action that suits your business, such as Messenger or Instagram messages, calls, or a quote form, and track it from day one."),
              ("Which services work best on Facebook and Instagram?","Anything visual does well: detailing transformations, tint and PPF installs, ceramic coating finishes and headlight restorations. We build the creative around your real work.")]),
    dict(slug="website-creation", title="Website Creation", tag="Conversion", icon="web",
         short="A great ad sending people to a weak page wastes money. We build fast, mobile-first sites that show your work and turn visitors into booked jobs.",
         h1="Website design for automotive businesses",
         meta="Fast, mobile-first websites for detailers, tinters, ceramic coating and PPF businesses, built to turn ad clicks and Google searches into booked jobs.",
         overview="Your website is where every ad click lands. We build clear, quick sites for detailing, tinting, ceramic coating, PPF and headlight restoration businesses, built around one goal: getting the customer to enquire or book.",
         different=["Built to convert first, with your packages, photos and booking form up front","Fast on mobile, where most car owners will see it","Matches your ads so the offer on the page is the offer they clicked"],
         process=["Map the journey from ad click to booked job","Design and build the site around your services and your best work","Test speed and the mobile experience before launch","Refine based on how visitors actually use it"],
         benefits=["More enquiries from the same ad spend","A site that makes a new customer trust you quickly","One place for your services, gallery and contact details"],
         faq=[("What goes on a website for an automotive business?","Your services and packages, a gallery of real work, your service area, clear contact options and a simple enquiry or booking form. Reviews go in once they're real."),
              ("Will my site show up on Google?","We build every page with clean structure, fast loading and the details search engines look for. No one can guarantee a ranking, but a well-built site gives you the best start."),
              ("Can the site match my ads?","Yes. Each campaign can land on a page that repeats the offer in the ad, which makes it easier for visitors to act.")]),
    dict(slug="google-ads", title="Google Ads", tag="Search", icon="search",
         short="Be the business people find the moment they search for car detailing, ceramic coating or window tinting in your area.",
         h1="Google ads for automotive businesses",
         meta="Google search ads for car detailing, window tinting, ceramic coating, PPF and headlight restoration businesses. Reach local customers the moment they search.",
         overview="People who search for a service near them are often ready to book. Google Ads puts your business at the top of those searches. We set up and manage campaigns for automotive businesses so you pay for searches that can turn into jobs.",
         different=["Campaigns built around the searches car owners actually make in your suburbs","Separate ad groups for each service, such as ceramic coating, PPF, tinting and headlight restoration","Call and enquiry tracking, so we count jobs and not only clicks"],
         process=["Research the local searches and competitors for each service","Build tightly focused campaigns and ads for each service","Track calls and form enquiries from day one","Trim wasted searches and put budget behind what converts"],
         benefits=["Reach customers at the moment they are looking for you","Pay for local searches, not for people far outside your area","Know which searches lead to enquiries"],
         faq=[("Is Google Ads or Meta Ads better for car detailing and tinting?","They do different jobs. Google catches people who are already searching, while Meta puts your work in front of people before they search. Many businesses use both."),
              ("Can Google ads target only my suburbs?","Yes. We set the location, and add negative keywords, so your budget goes to searches from your area."),
              ("How do you track phone calls from Google Ads?","We set up call and form tracking so each enquiry is tied back to the search that produced it.")]),
    dict(slug="targeting", title="Targeting", tag="Reach", icon="target",
         short="Stop paying to show your ads to people who'll never book. We aim at the right suburbs, the right car owners and the right buying signals.",
         h1="Audience targeting for automotive businesses",
         meta="Local audience targeting for detailers, tinters, ceramic coating and PPF businesses. Show your ads to car owners near you, not people who will never book.",
         overview="Showing an ad to the wrong people is the fastest way to burn budget. We build targeting that puts your detailing, tinting, coating or PPF offer in front of people who are likely to enquire, close enough to actually visit.",
         different=["Targeting built around your real customers and your service area","Separate plans for new customers and for people who already know you","Constant refinement as the campaigns learn"],
         process=["Define your service area and your most valuable customers","Build audiences from cold to warm, including website visitors and past customers","Test and refine using real enquiry data","Concentrate spend on the segments that book"],
         benefits=["Less budget wasted on the wrong audience","A lower cost per enquiry over time","A faster path to a profitable campaign"],
         faq=[("How do you choose who sees my ads?","We start with your service area and your best customers, then test audiences and keep the ones that produce enquiries."),
              ("What is retargeting?","Showing ads to people who have already visited your site or engaged with your page, so warm leads get a reminder to book."),
              ("Can you target by suburb?","Yes. Local businesses usually get the best results by focusing tightly on the suburbs they can actually serve.")]),
    dict(slug="ad-creatives", title="Ad Creatives", tag="Creative", icon="creative",
         short="Ads that get noticed. Before and afters, finished-car shots and short clips that make people stop scrolling and enquire.",
         h1="Ad creative for automotive businesses",
         meta="Before-and-after photos, short video and ad copy for detailers, tinters, ceramic coating and PPF businesses, built from your real work.",
         overview="The ad is the first thing a customer sees, and in a visual trade your work is your best ad. We turn your jobs into images, video and copy built to stop the scroll and get the enquiry.",
         different=["Creative built from your real work: transformations, process clips and finished cars","Several versions tested against each other so data picks the winner","Made for each platform, not one image resized"],
         process=["Collect your best jobs, photos and clips","Produce several concepts and hooks to test","Find the winners and scale them","Refresh regularly so the ads don't go stale"],
         benefits=["More clicks for the same spend","Ads that build trust before the first message","A library of proven ads you own"],
         faq=[("Do I need to supply photos and video?","Photos and short clips from your jobs work best, and we show you what to capture. We handle the editing, copy and formats."),
              ("How often do ads need refreshing?","Usually every few weeks. When the same people see the same ad too often, results drop, so we rotate in new versions."),
              ("Who owns the ads we make?","You do. The creative library is yours to keep.")]),
    dict(slug="tiktok-ads", title="TikTok Ads", tag="Short-Form Video", icon="tiktok",
         short="Get in front of local car owners without a big budget. Short, satisfying detailing and tint clips are made for TikTok, and we make sure yours stop the scroll.",
         h1="TikTok ads for automotive businesses",
         meta="TikTok ads for car detailing, tinting, ceramic coating and PPF businesses. Short transformation videos that reach local car owners.",
         overview="Transformation videos do well on TikTok, and your future customers are already watching them. We build TikTok campaigns that feel native to the platform so they earn attention instead of getting skipped.",
         different=["Creative built for how TikTok works, not repurposed ads from other platforms","Quick hook testing to find what holds attention","Campaigns aimed at enquiries and bookings, not just views"],
         process=["Research what's already working in the automotive niche","Test several hooks and formats in parallel","Scale budget behind the videos that convert","Refresh regularly to keep results up"],
         benefits=["More enquiries from people in your area","A cost-effective way to reach car owners","Brand visibility that builds over time"],
         faq=[("Does TikTok work for local car businesses?","It can. Satisfying before-and-after clips suit the platform, and local targeting keeps the spend to people near you."),
              ("What kind of videos work best?","Short transformations, process clips and finished-car reveals, with a strong first second."),
              ("Do I need to be on TikTok already?","No. We run the ads from the ad account and build the creative from your work.")]),
]

# --------------------------------------------------------------------------- industries
INDUSTRIES = [
    dict(slug="car-detailing", offers=["A full-detail package priced clearly, with what's included listed", 'A first-visit offer, such as an interior refresh for new customers', 'Seasonal offers timed to when people care about their car, like before winter or after a long trip', 'A maintenance wash plan that turns one job into repeat visits'], creative=['Before-and-after photos taken in the same light and angle', 'A short time-lapse of a full detail', 'A close-up of paint after a clay bar and polish', "A walk-around of the finished car, with the owner's reaction if they agree"], plan=['Week 1: set up tracking, pick one flagship package and build the first set of ads and a landing page', "Weeks 2 to 3: test several creatives and audiences, and cut what isn't producing enquiries", 'Week 4: put more budget behind the winners and add retargeting for people who enquired or visited'], title="Car Detailing", h1="Marketing for car detailing businesses", crumb="Car detailing",
         meta="Meta, Google and TikTok advertising for car detailing businesses. Fill your booking calendar with local car owners. Kyro Marketing, Australia.",
         intro="Detailing is a visual trade, so the right ads sell themselves: a dull car on one side, a showroom finish on the other. We build campaigns that put those results in front of car owners in your suburbs and turn them into booked jobs.",
         angles=[("Lead with the transformation","Before-and-after photos and short clips make the strongest detailing ads, so we build campaigns around your real jobs."),
                 ("One offer per package","Interior, exterior and full details each get their own offer and landing page, so a visitor sees exactly what they came for."),
                 ("Catch people when they search","Searches like car detailing near me and mobile car detailing are ready-to-book searches. Google Ads covers them."),
                 ("Keep customers coming back","Retargeting past customers and website visitors brings people back for maintenance washes and add-on services.")],
         cases=["Car Detailing Cairns","Car Detailing Newcastle"],
         faq=[("How many bookings can detailing ads bring in?","It depends on your area, budget and offer. In our published case studies, a Cairns detailer received 10 bookings in one week and a Newcastle detailer 18 bookings in two weeks."),
              ("Should I advertise mobile detailing differently?","Yes. Mobile detailers target a service radius rather than a fixed address, and the ad copy should say clearly which suburbs you cover."),
              ("What should I post to attract detailing customers?","Real transformations: before-and-after photos, time-lapses of a full detail and finished-car shots in good light.")]),
    dict(slug="car-wash", offers=['A simple, clearly priced hand-wash package', 'A bundle that adds interior vacuum or tyre shine', 'A loyalty or multi-wash card for regulars', 'A weekday offer to fill quiet periods'], creative=['A before-and-after of a very dirty car', 'A satisfying clip of foam and rinse', 'Your team at work, which builds trust in a local business', 'A map-style graphic showing the suburbs you serve'], plan=['Week 1: set a tight radius around your site, set up message tracking and launch one clear offer', 'Weeks 2 to 3: test offers and creatives, and narrow the radius to the suburbs that respond', "Week 4: scale the best ad and add a retargeting offer for people who messaged but didn't book"], title="Car Wash", h1="Marketing for car wash businesses", crumb="Car wash",
         meta="Facebook, Instagram and Google ads for hand car wash and car wash businesses. Bring in local drivers and repeat customers. Kyro Marketing, Australia.",
         intro="Car wash customers are local and they decide fast. We run ads that reach drivers within a few minutes of your site, and that turn first-time washes into regulars.",
         angles=[("Target drivers close to you","A car wash lives or dies on distance, so we focus tightly on the suburbs around your site."),
                 ("Make the offer obvious","A clear price, a clear package and a clear way to book beat clever copy for a service people want quickly."),
                 ("Show up for near me searches","Google search ads place you in front of drivers who are looking for a hand car wash right now."),
                 ("Build repeat customers","Retargeting and simple loyalty offers turn a one-off wash into a regular visit.")],
         cases=["Hand Car Wash Melbourne"],
         faq=[("Do Facebook ads work for a car wash?","They can, particularly when targeted to nearby drivers. In our Melbourne case study, a hand car wash received 60 messages in 20 days."),
              ("How far should I target around my car wash?","Most car washes get their best results close to the site. We test the radius and tighten it around the suburbs that actually book."),
              ("Can ads help with memberships or packages?","Yes. We can build a campaign for a wash package or membership offer and track how many people sign up.")]),
    dict(slug="window-tinting", offers=['A free quote with a fast reply promise', 'A package for a specific car type, such as a sedan or SUV, with film options listed', 'A heat and UV angle for hot months', "A separate home-tint offer so that audience doesn't mix with car customers"], creative=['Side-by-side shots of a tinted and untinted window', 'A short clip showing the difference in heat or glare', 'The film brand and warranty on screen', 'A finished-car shot that shows the look'], plan=['Week 1: set up quote tracking, split car and home campaigns and launch one benefit-led ad for each', 'Weeks 2 to 3: test benefits such as heat, privacy and looks, and keep the one that brings quote requests', "Week 4: scale the winner, speed up your reply time, and retarget visitors who didn't ask for a quote"], title="Window Tinting", h1="Marketing for window tinting businesses", crumb="Window tinting",
         meta="Facebook, Instagram, Google and TikTok ads for car and window tinting businesses. Get more quote requests and booked jobs. Kyro Marketing, Australia.",
         intro="People shop for tint on heat, privacy and looks, and they want a quote quickly. We build campaigns that put those benefits in front of the right people and make asking for a quote easy.",
         angles=[("Sell the benefits people care about","Heat reduction, UV protection, privacy and appearance each make a strong angle, and we test which one your customers respond to."),
                 ("Make quoting simple","A short quote form or a message button removes friction. Fast replies win these jobs."),
                 ("Separate car and home","Car tint and home tint attract different customers, so each gets its own campaign and tracking."),
                 ("Show film brands and warranty","Naming your films and warranty on the ad and landing page builds trust before the first message.")],
         cases=["Window Tinting Brisbane","Car Tinting Gold Coast"],
         faq=[("How much do tint enquiries cost with ads?","It varies by area and offer. For one tint client, we ran separate campaigns and averaged about $14.64 per messaging conversation across 468 enquiries."),
              ("Should car tint and home tint be advertised separately?","Yes. They are different customers with different questions, and separate campaigns let you see what each one costs and brings in."),
              ("What makes a good window tint ad?","A clear benefit such as heat or privacy, a real photo of your work and an easy way to ask for a quote.")]),
    dict(slug="ceramic-coating", offers=['A coating package tiers list so customers can choose', 'A free paint assessment before booking', 'A care-and-maintenance add-on after the coating', 'An offer for new-car owners who want protection from day one'], creative=['Water beading on a freshly coated panel', 'Close-ups of gloss and depth', 'A short explainer on what the coating protects against', 'Before-and-after of a corrected, coated car'], plan=['Week 1: set up enquiry tracking, launch awareness video and a quote-request campaign', 'Weeks 2 to 4: keep showing your work to people who watched or visited, as this is a longer decision', 'Ongoing: send warm leads to a simple booking step and keep the creative fresh'], title="Ceramic Coating", h1="Marketing for ceramic coating businesses", crumb="Ceramic coating",
         meta="Instagram, Facebook and Google ads for ceramic coating businesses. Reach car owners ready to protect their paint. Kyro Marketing, Australia.",
         intro="Ceramic coating is a considered purchase. Customers compare, ask questions and take their time, so the ads need to build trust and keep you in front of them until they book.",
         angles=[("Show the finish","Close-up gloss, water beading and before-and-after shots are the proof that sells a coating."),
                 ("Plan for a longer decision","Retargeting visitors and video viewers keeps you visible while they compare quotes."),
                 ("Qualify the lead","Higher-priced work needs the right enquiries. Clear pricing signals and a short form keep the wrong leads out."),
                 ("Capture search intent","People searching for ceramic coating in their city are close to buying, and Google Ads reaches them.")],
         cases=["Ceramic Coating Perth"],
         faq=[("How long does it take for ceramic coating ads to bring bookings?","Interest can start within days, but this is a considered purchase. In our Perth case study, before-and-after content produced 28 bookings in 30 days."),
              ("Are ceramic coating leads more expensive?","Typically, yes, because the job is higher value. The aim is quality enquiries that turn into bookings, not the lowest cost per lead."),
              ("What content works for ceramic coating?","Close-up finish shots, water beading, before-and-afters and short explainer clips on the protection and care.")]),
    dict(slug="paint-protection-film", offers=['Clear coverage packages, such as front-end or full-front, with what each covers', 'A new-car protection offer with a fast turnaround on the quote', 'A consultation before booking to qualify the enquiry', 'A bundle with ceramic coating or a detail'], creative=['Close shots of clean edges and film coverage', 'A before-and-after of a stone-chip-prone area', 'A short clip of an install in progress', 'A finished new car on the lot or in your studio'], plan=['Week 1: set up enquiry tracking and launch a campaign aimed at new and premium car owners in your area', 'Weeks 2 to 4: test coverage offers and creative, and add Google Ads for people searching for PPF', 'Ongoing: retarget visitors and video viewers, as this is a high-value decision that takes time'], title="Paint Protection Film (PPF)", title_tag="Paint Protection Film Marketing", h1="Marketing for paint protection film (PPF) installers", crumb="Paint protection film",
         meta="Meta and Google advertising for paint protection film (PPF) installers. Reach new-car owners and enthusiasts ready to protect their paint. Kyro Marketing, Australia.",
         intro="PPF is a high-value job for customers who care about their car. Our campaigns reach new-car owners and enthusiasts, show the quality of your installs and bring you serious enquiries.",
         angles=[("Target new and high-value cars","Owners of new and premium vehicles are your best audience, and detailed targeting finds them."),
                 ("Show installation quality","Close shots of clean edges and coverage options build the trust a high-ticket job needs."),
                 ("Offer clear coverage packages","Front-end, partial and full coverage options help customers picture their choice and ask for the right quote."),
                 ("Expect a higher cost per enquiry","PPF costs more per enquiry than lower-priced services. In one multi-service campaign, PPF enquiries cost $19.08 each against about $13 for tint.")],
         cases=[],
         faq=[("What does it cost to get a PPF enquiry?","It depends on your area and offer. In one campaign we ran, paint protection enquiries cost $19.08 each, higher than tint, which is normal for a higher-priced service."),
              ("Who should PPF ads target?","Owners of new and premium cars, car enthusiasts and people near dealerships, within the suburbs you can serve."),
              ("Is it worth running Google Ads for PPF?","Often yes. People searching for paint protection film in their city are close to buying.")]),
    dict(slug="headlight-restoration", offers=['A fixed price for a pair, with the turnaround time stated', 'A bundle with a detail or an inspection', 'A same-day service for local drivers', 'A free assessment for cloudy or yellowed lenses'], creative=['A clear side-by-side of a yellowed and a restored headlight', 'A short before-and-after clip', 'A night shot showing the improved beam', 'The price and area on the image'], plan=['Week 1: set up call and form tracking and launch Google Ads for headlight restoration searches in your suburbs', 'Weeks 2 to 3: add a simple Meta ad with the before-and-after and test it against the search results', 'Week 4: add the bundle offer to lift the value of each booking'], title="Headlight Restoration", h1="Marketing for headlight restoration businesses", crumb="Headlight restoration",
         meta="Google and Meta ads for headlight restoration services. Reach drivers with cloudy headlights and bundle with detailing. Kyro Marketing, Australia.",
         intro="Headlight restoration is quick, affordable and easy to show. The best campaigns catch drivers searching for a fix and bundle the service with a detail or inspection.",
         angles=[("Win the search","People with yellowed headlights often search for a fix. Google Ads puts you at the top of those searches."),
                 ("Show the difference","A cloudy lens next to a clear one is the entire pitch, and it works well as a short video or image."),
                 ("Bundle it","Pairing restoration with a detail raises the value of each booking."),
                 ("Keep the offer simple","A clear price and a quick turnaround time make it easy to say yes.")],
         cases=[],
         faq=[("Are ads worth it for a low-priced service like headlight restoration?","They can be, especially as an add-on that lifts the value of every booking. We keep the cost per enquiry low with tight local targeting."),
              ("What should the ad show?","A before-and-after of the lens, a clear price and your service area."),
              ("Can I bundle headlight restoration with other services?","Yes, and it is usually the best approach. A combined offer raises the average job value.")]),
]

# --------------------------------------------------------------------------- case studies (automotive)
CASES = [
    dict(tag="Car Wash · Melbourne", name="Hand Car Wash Melbourne", stat="60", label="messages in 20 days",
         body="A local-focused Meta campaign turned nearby drivers into direct enquiries, generating a steady stream of messages within the first three weeks.", industry="car-wash"),
    dict(tag="Window Tinting · Brisbane", name="Window Tinting Brisbane", stat="3×", label="ROAS in 15 days",
         body="Targeted Facebook and Instagram ads reached homeowners and drivers across Brisbane, turning ad spend into booked jobs within two weeks.", industry="window-tinting"),
    dict(tag="Car Detailing · Cairns", name="Car Detailing Cairns", stat="10", label="bookings in 1 week",
         body="A tightly targeted local campaign filled the booking calendar fast, proving out the channel before scaling further.", industry="car-detailing"),
    dict(tag="Ceramic Coating · Perth", name="Ceramic Coating Perth", stat="28", label="bookings in 30 days",
         body="Before-and-after finish photos and video across Instagram and Facebook turned viewers into booked ceramic coating appointments.", industry="ceramic-coating"),
    dict(tag="Car Tinting · Gold Coast", name="Car Tinting Gold Coast", stat="5×", label="ROAS in 20 days",
         body="Localised video ads highlighting heat reduction and UV protection drove a steady stream of tinting bookings across the Gold Coast.", industry="window-tinting"),
    dict(tag="Car Detailing · Newcastle", name="Car Detailing Newcastle", stat="18", label="bookings in 2 weeks",
         body="A tightly targeted local campaign built around before-and-after detailing content quickly filled the booking calendar.", industry="car-detailing"),
]

# --------------------------------------------------------------------------- process / about / faq
PROCESS = [
    ("Discover","We audit your workshop, your services, your local competitors and your current ads to find where the next bookings will come from."),
    ("Strategize","A plan built around your best-margin services, such as ceramic coating, PPF, tinting or full details, with a clear offer for each."),
    ("Launch","Campaigns go live on Meta, Google and TikTok with clean testing and call and enquiry tracking, so we learn fast without wasting spend."),
    ("Optimize","We review performance weekly and move budget toward the services and ads that are filling your calendar, cutting what isn't."),
]
ABOUT_PILLARS = [
    ("Small by design","A focused team means your account gets senior attention, not a rotating cast of junior managers."),
    ("Hands-on, always","No black-box dashboards. You can reach the people actually running your campaigns, directly."),
    ("Built around your numbers","Every decision traces back to revenue and ROAS, not impressions or vanity metrics."),
]
HOME_FAQ = [
    ("How quickly can we get started?","Most clients are live within 5-7 business days of onboarding, once we have access to your ad accounts and any brand assets."),
    ("Do you work with automotive businesses?","Yes, that's our focus: car detailing and washing, window tinting, ceramic coating, PPF and headlight restoration businesses."),
    ("Can you promote a specific service, like ceramic coating or PPF?","Yes. We build a separate campaign for each service, so every offer gets its own ads, targeting and tracking, and you can see which ones bring in the most jobs."),
    ("Which platforms do you manage?","Meta, TikTok, and Google Ads by default, with ad creative and website support available alongside any of them."),
    ("Is there a minimum ad spend?","No strict minimum, though most clients see the strongest results starting around $500-$3,000 per month in ad spend."),
    ("Do you require long-term contracts?","No. Engagements are month-to-month, so you're never locked in past the point it's working for you."),
    ("How do you report on performance?","Weekly check-ins plus a clear monthly summary tied to revenue and ROAS, not just clicks or impressions."),
]

# --------------------------------------------------------------------------- additions for the React site
SITE["phone"] = "+61494625754"
SITE["phone_display"] = "0494 625 754"

_SHORT = {
    "car-detailing": "Fill your booking calendar with before-and-after ads that turn local car owners into booked jobs.",
    "car-wash": "Reach drivers near your site and turn first-time washes into regular customers.",
    "window-tinting": "Bring in quote requests for car and home tint with benefit-led ads and fast follow-up.",
    "ceramic-coating": "Build trust with high-value car owners and stay in front of them until they book.",
    "paint-protection-film": "Reach new-car owners and enthusiasts with ads that show the quality of your PPF installs.",
    "headlight-restoration": "Catch drivers searching for a fix and bundle restoration with a detail to lift every booking.",
}
for _i in INDUSTRIES:
    _i["short"] = _SHORT[_i["slug"]]
    _i["tag"] = "Automotive"

LEGAL = {
  "privacy": {"title": "Privacy policy", "updated": "20 November 2026", "sections": [
    {"h": "What we collect", "p": ["When you apply through our form we collect the details you give us: your name, phone number, the type of business you run, your ad budget range and any message. We also collect basic website analytics."]},
    {"h": "How we use it", "ul": ["To reply to your application and discuss our services.", "To understand how visitors use the site, so we can improve it."], "p": ["We do not sell your personal information."]},
    {"h": "Who handles it", "p": ["Form submissions are sent to us through Web3Forms, a form processing service, and arrive by email. Site analytics are provided by Google Analytics, which uses cookies or similar technology to measure visits."]},
    {"h": "Your choices", "p": ["You can ask to see, correct or delete the information we hold about you at any time by emailing " + SITE["email"] + ". You can also block analytics cookies in your browser settings."]},
    {"h": "Contact", "p": ["Questions about this policy: " + SITE["email"] + "."]},
  ]},
  "terms": {"title": "Terms", "updated": "20 November 2026", "sections": [
    {"h": "About this site", "p": ["This website describes the advertising services offered by Kyro Marketing. Nothing on it is a binding offer. Services are provided under a separate written agreement."]},
    {"h": "Results", "p": ["The case studies and ad screenshots on this site are examples of real campaigns. Results vary by business, location, budget, offer and market conditions, and we cannot guarantee particular results."]},
    {"h": "Month-to-month", "p": ["Our engagements are month-to-month unless we agree otherwise in writing."]},
    {"h": "Third-party platforms", "p": ["Our work runs on platforms such as Meta, Google and TikTok. Their policies, pricing and availability can change and are outside our control."]},
    {"h": "Contact", "p": ["Questions about these terms: " + SITE["email"] + "."]},
  ]},
}

def data_for_js():
    services = [dict(slug=s["slug"], title=s["title"], tag=s["tag"], icon=s["icon"], short=s["short"], h1=s["h1"], overview=s["overview"],
                     different=s["different"], process=s["process"], benefits=s["benefits"], faq=[list(x) for x in s["faq"]]) for s in SERVICES]
    inds = [dict(slug=i["slug"], title=i["title"], tag=i["tag"], short=i["short"], h1=i["h1"], overview=i["intro"],
                 different=[f"{t}. {b}" for t, b in i["angles"]], process=i["plan"], benefits=i["offers"], creative=i["creative"],
                 faq=[list(x) for x in i["faq"]], cases=i["cases"]) for i in INDUSTRIES]
    cases = [dict(tag=c["tag"], name=c["name"], stat=c["stat"], label=c["label"], body=c["body"], industry=c["industry"]) for c in CASES]
    return dict(services=services, industries=inds, cases=cases, homeFaq=[list(x) for x in HOME_FAQ], legal=LEGAL)
