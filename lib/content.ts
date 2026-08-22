import type { CalculatorMode } from "./fees/types";

export type PageContent = {
  path: string;
  title: string;
  description: string;
  calculatorMode?: CalculatorMode;
  sections: { heading: string; body: string[] }[];
  faq?: { q: string; a: string }[];
};

export const contentPages: PageContent[] = [
  {
    path: "/paypal-fee-calculator/",
    title: "PayPal Fee Calculator",
    description: "Estimate PayPal processing fees, fixed fees, international surcharges, and net received amounts from one focused calculator.",
    sections: [
      { heading: "What this calculator is best for", body: ["Use this page when you want a general PayPal fee estimate for goods and services, commercial payments, invoices, or merchant card payments. The result is split into fee lines so you can see which part of the cost comes from the base processing rate, fixed fee, international surcharge, and currency conversion estimate."] },
      { heading: "Why rates are source-tracked", body: ["PayPal fees vary by market and product. FeeClarity keeps rate data in a separate rules module with effective dates, verification dates, and source links. That makes the calculator easier to audit and update when PayPal changes a fee schedule."] },
    ],
  },
  {
    path: "/paypal-international-fee-calculator/",
    title: "PayPal International Fee Calculator",
    description: "Estimate PayPal international transaction costs separately from domestic processing fees and currency conversion costs.",
    sections: [
      { heading: "International payments can have more than one fee", body: ["An international PayPal transaction can include the ordinary domestic receiving fee plus an additional international percentage-based fee. If the payment currency differs from the receiving currency, PayPal's transaction exchange rate may add a separate conversion cost."] },
      { heading: "How to use this page", body: ["Set the sender's country, recipient's country, payment amount, and currencies involved. Keep the international option enabled when the sender and recipient PayPal accounts are in different markets."] },
    ],
  },
  {
    path: "/paypal-reverse-fee-calculator/",
    title: "PayPal Reverse Fee Calculator",
    description: "Calculate how much to request so you receive a target amount after estimated PayPal fees.",
    calculatorMode: "target_receive",
    sections: [
      { heading: "How reverse PayPal fee calculation works", body: ["Instead of subtracting fees from a sale amount, reverse calculation starts with the net amount you need to receive and solves for the approximate gross amount to request. This is useful for freelancers, consultants, sellers, and anyone preparing an invoice."] },
      { heading: "Rounding matters", body: ["FeeClarity rounds the requested amount to normal money precision after solving the fee equation. Because payment processors also round line items, treat the result as a practical estimate rather than a legal quote."] },
    ],
  },
  {
    path: "/paypal-currency-conversion-calculator/",
    title: "PayPal Currency Conversion Calculator",
    description: "Estimate the currency conversion portion of a PayPal payment separately from processing and fixed fees.",
    sections: [
      { heading: "Conversion costs should be visible", body: ["When PayPal converts currency, the transaction exchange rate may include a conversion spread. FeeClarity shows the estimated conversion cost separately so it does not get confused with the processing fee."] },
      { heading: "Latest market rate with manual override", body: ["For cross-currency estimates, FeeClarity can auto-fill a latest daily market reference rate from Frankfurter. The field remains editable because PayPal's final displayed exchange rate may differ from a market reference rate. If you paste PayPal's displayed rate, turn off the currency conversion estimate to avoid double-counting the spread."] },
      { heading: "When to use it", body: ["Use this page when the customer pays in one currency and you receive another, or when you are comparing PayPal with providers that price currency conversion differently."] },
    ],
  },
  {
    path: "/paypal-invoice-fee-calculator/",
    title: "PayPal Invoice Fee Calculator",
    description: "Estimate fees for PayPal invoice payments and see the amount received after processing costs.",
    sections: [
      { heading: "Invoice payments", body: ["PayPal invoicing lets a customer pay a requested amount through several funding methods. In the US schedule, PayPal and Venmo invoice payments use a published percentage plus fixed fee, while some card-funded invoice payments may use a different rate."] },
      { heading: "Use for pricing work", body: ["Before sending a client invoice, calculate both the estimated fee and the amount to request if you need to receive a specific net amount."] },
    ],
  },
  {
    path: "/paypal-goods-and-services-fee-calculator/",
    title: "PayPal Goods and Services Fee Calculator",
    description: "Estimate PayPal Goods and Services fees for purchases, sales, and service payments.",
    sections: [
      { heading: "Goods and Services payments", body: ["Goods and Services payments are commercial in nature and can be priced differently from personal payments. Use this page for seller-style receiving estimates where buyer protection and seller terms may apply."] },
      { heading: "Personal payments are different", body: ["FeeClarity does not treat personal payments as a universal substitute for commercial payments. Choose the transaction type that matches the real payment purpose."] },
    ],
  },
  {
    path: "/paypal-merchant-fee-calculator/",
    title: "PayPal Merchant Fee Calculator",
    description: "Estimate PayPal merchant processing costs for business payments and card-funded transactions.",
    sections: [
      { heading: "Merchant fee planning", body: ["Merchant fees affect margins, pricing, and invoice strategy. This calculator is built for quick estimates and separates each fee line so finance and operations teams can review the assumptions."] },
      { heading: "Future provider expansion", body: ["The fee engine is provider-agnostic. PayPal is the first implemented provider, and the same structure can support Stripe, Wise, Payoneer, Square, Shopify, Etsy, and eBay calculators later."] },
    ],
  },
  {
    path: "/paypal-fees/",
    title: "PayPal Fees",
    description: "A plain-English guide to PayPal fees, including processing fees, fixed fees, international fees, and conversion costs.",
    sections: [
      { heading: "The main parts of a PayPal fee", body: ["A PayPal fee estimate usually starts with a percentage-based processing fee and may also include a fixed fee based on the receiving currency. International payments and currency conversion can add separate costs, so FeeClarity separates each component instead of presenting one unexplained number."] },
      { heading: "Why a single PayPal rate can be misleading", body: ["The fee that applies depends on the recipient market, sender market, transaction type, payment currency, receiving currency, and account terms. A US PayPal Checkout payment, a card-funded invoice, and an international payment to another market may not use the same rule."] },
      { heading: "Best next step", body: ["Use the PayPal Fee Calculator for a full estimate, the Reverse PayPal Fee Calculator when you need to receive an exact net amount, or the International PayPal Fee Calculator when sender and recipient countries differ."] },
    ],
  },
  {
    path: "/paypal-international-fees/",
    title: "PayPal International Fees",
    description: "Understand when PayPal international fees may apply and how they differ from domestic receiving fees.",
    sections: [
      { heading: "When a PayPal payment becomes international", body: ["FeeClarity treats a payment as international when the sender and recipient PayPal accounts are in different markets, or when the international option is selected. In supported rules, the international amount is shown as its own percentage-based line so it does not get mixed into the domestic processing fee."] },
      { heading: "International fee is not the same as currency conversion", body: ["A cross-border payment can be international even if no currency is converted. Currency conversion is a separate estimate that applies when the payment currency and receiving currency differ, or when PayPal displays a transaction exchange rate."] },
      { heading: "What to verify before relying on the result", body: ["Check the recipient country's PayPal fee schedule, the sender region, the payment type, the fixed fee currency, and whether PayPal or another provider is performing the currency conversion. Unsupported country combinations should be treated as unavailable rather than guessed."] },
    ],
  },
  {
    path: "/how-much-does-paypal-charge/",
    title: "How Much Does PayPal Charge?",
    description: "Learn what affects PayPal charges and use the calculator to estimate the fee for a specific transaction.",
    sections: [
      { heading: "The short answer", body: ["PayPal does not charge one universal fee for every transaction. The amount depends on where the recipient account is based, where the sender is based, which payment product is used, and whether the payment includes international or currency conversion costs."] },
      { heading: "Inputs that usually change the fee", body: ["The most important inputs are the gross payment amount, transaction type, sender country, recipient country, payment currency, receiving currency, and whether a currency conversion spread should be estimated. FeeClarity exposes these assumptions so the result can be reviewed."] },
      { heading: "How to get a practical estimate", body: ["Start with the exact payment amount and choose the transaction type that matches the real payment purpose. If you need the recipient to receive a specific net amount, use the reverse calculator instead of simply adding a percentage on top."] },
    ],
  },
  {
    path: "/how-to-calculate-paypal-fees/",
    title: "How to Calculate PayPal Fees",
    description: "A practical formula-driven guide to calculating PayPal fees from percentage, fixed, international, and conversion components.",
    sections: [
      { heading: "Basic PayPal fee formula", body: ["For many commercial payments, the estimate is: transaction amount multiplied by the applicable percentage rate, plus any fixed fee. If the payment is international, an additional percentage may apply. If PayPal converts currency, conversion cost should be reviewed separately."] },
      { heading: "Reverse calculation formula", body: ["When you want to receive an exact amount, solve backward from the desired net amount. For a simple percentage plus fixed-fee transaction, the gross request is approximately: target net plus fixed fee, divided by one minus the total percentage rate."] },
      { heading: "Why FeeClarity uses decimal-safe calculations", body: ["Payment-fee math is sensitive to rounding. FeeClarity keeps fee rules separate from calculation logic and rounds money outputs to normal currency precision so examples are easier to audit."] },
    ],
  },
  {
    path: "/paypal-currency-conversion-fees/",
    title: "PayPal Currency Conversion Fees",
    description: "Understand PayPal currency conversion fees and why exchange-rate spreads should be reviewed separately.",
    sections: [
      { heading: "Currency conversion is an exchange-rate question", body: ["When PayPal converts one currency into another, the final transaction exchange rate may differ from a market reference rate. That difference can act like a conversion cost even when it is shown through the exchange rate rather than as a separate line item."] },
      { heading: "How FeeClarity estimates conversion cost", body: ["FeeClarity can load a latest daily market reference rate from Frankfurter when a supported currency pair is available. Users can also enter a manual rate. The calculator does not claim the reference rate is PayPal's exact final transaction rate."] },
      { heading: "Avoid double-counting", body: ["If you enter PayPal's final displayed exchange rate, turn off the separate currency conversion estimate. Otherwise the exchange-rate difference may be counted twice."] },
    ],
  },
  {
    path: "/paypal-fees-for-freelancers/",
    title: "PayPal Fees for Freelancers",
    description: "Estimate PayPal fees for freelance invoices and decide how much to request to receive a target amount.",
    sections: [
      { heading: "Why freelancers need reverse fee planning", body: ["Freelancers often quote a net amount for work but receive less after processing fees. The reverse calculator helps estimate the gross amount to request when you need a specific amount after fees."] },
      { heading: "Invoice details that matter", body: ["Before sending an invoice, confirm the client country, your account country, payment currency, receiving currency, and whether the client is paying through a method that uses a different PayPal fee rule."] },
      { heading: "How to explain fees to clients", body: ["Use FeeClarity as an internal pricing tool rather than presenting it as PayPal's final quote. Final fees can vary by account, funding source, currency conversion, and merchant agreement."] },
    ],
  },
  {
    path: "/paypal-fees-for-business/",
    title: "PayPal Fees for Business",
    description: "Plan PayPal processing costs for business transactions, online checkout, invoices, and international customers.",
    sections: [
      { heading: "Fees affect margin and pricing", body: ["For businesses, PayPal fees can affect product margins, invoice pricing, cross-border sales, and refund planning. A useful estimate separates base processing fees from international and currency-conversion assumptions."] },
      { heading: "Different payment products can price differently", body: ["Checkout-style payments, invoices, Goods and Services payments, and merchant card payments may not all share the same published rate. Choose the closest supported transaction type and confirm final pricing inside PayPal."] },
      { heading: "What businesses should track", body: ["Keep a record of the fee schedule used, verification date, currency, country pair, fixed fee, and whether your account has custom pricing. FeeClarity's methodology and rate log are built to make that audit trail visible."] },
    ],
  },
  {
    path: "/paypal-fees-for-invoices/",
    title: "PayPal Fees for Invoices",
    description: "A guide to PayPal invoice fees with a calculator for estimating net received amounts.",
    sections: [
      { heading: "Invoice fees depend on how the customer pays", body: ["A PayPal invoice can be paid through different funding methods, and some schedules distinguish invoice payments from other commercial payments. The selected country, payment type, and currency determine which verified rule FeeClarity can apply."] },
      { heading: "Estimate before you send the invoice", body: ["Use the standard calculator to estimate the amount received from a planned invoice amount, or use the reverse calculator when the invoice needs to produce a specific net amount after fees."] },
      { heading: "Final review checklist", body: ["Confirm the invoice amount, sender country, recipient country, payment currency, receiving currency, international status, and whether currency conversion will happen before relying on the estimate."] },
    ],
  },
  ...[
    ["/paypal-fees/us/", "PayPal Fees in the US", "US PayPal fee estimates using published PayPal US merchant fee schedule data.", "FeeClarity includes verified US commercial payment rules from PayPal's published US merchant fee schedule, including separate handling for Goods and Services, PayPal Checkout-style commercial payments, invoices, merchant card payments, fixed fees, and international add-ons."],
    ["/paypal-fees/canada/", "PayPal Fees in Canada", "Canada PayPal fee estimates using published PayPal Canada merchant fee schedule data.", "FeeClarity includes verified Canada commercial receiving rules from PayPal's published Canada merchant fee schedule, including domestic fees and separate international add-ons for US senders and other international senders."],
    ["/paypal-fees/uk/", "PayPal Fees in the UK", "UK PayPal fee estimates using published PayPal UK merchant fee schedule data.", "FeeClarity includes verified UK commercial receiving rules from PayPal's published UK merchant fee schedule for the calculator's supported country combinations, including domestic fees and non-EEA international add-ons."],
    ["/paypal-fees/australia/", "PayPal Fees in Australia", "Australia PayPal fee estimates using published PayPal Australia merchant fee schedule data.", "FeeClarity includes verified Australia commercial receiving rules from PayPal's published Australia merchant fee schedule, including domestic commercial fees and international commercial add-ons."],
    ["/paypal-fees/philippines/", "PayPal Fees in the Philippines", "Philippines PayPal fee estimates using published PayPal Philippines merchant fee schedule data.", "FeeClarity includes verified Philippines commercial receiving rules from PayPal's published Philippines merchant fee schedule, including domestic commercial fees, international receiving fees, fixed fees, and source-labeled currency conversion estimates."],
    ["/paypal-fees/india/", "PayPal Fees in India", "India PayPal fee estimates using published PayPal India merchant fee schedule data.", "FeeClarity includes verified India international commercial receiving rules from PayPal's published India merchant fee schedule. Domestic India receiving estimates are blocked because the current supported PayPal India rule set is international-only."],
  ].map(([path, title, description, countryCopy]) => ({
    path, title, description,
    sections: [
      { heading: "Country-specific fee rules", body: [countryCopy] },
      { heading: "How to use this country page", body: [`Use ${title} when the receiving PayPal account is based in this market. Start with the calculator, then check the fee lines, source link, effective date, and last verified date before relying on the result.`] },
      { heading: "What to verify", body: ["Check PayPal's local fee schedule for domestic rates, international surcharge rules, fixed fees by currency, payment method eligibility, and conversion spread language. These values can change by account type, product, and custom merchant agreement."] },
      { heading: "What FeeClarity will not estimate", body: ["FeeClarity does not fill gaps with another country's PayPal pricing. If a domestic rule, payment method, fixed fee, or currency-conversion detail is not verified in the current rate table, the calculator should show a limitation instead of inventing a number."] },
      { heading: "Useful next step", body: ["Run a small test amount through the calculator first, then compare the source-linked assumptions with the fee details PayPal displays for the actual payment route. This is especially important for international payments, card-funded payments, and accounts with custom merchant pricing."] },
    ],
  })),
  {
    path: "/methodology/",
    title: "FeeClarity Methodology",
    description: "How FeeClarity verifies payment fee sources, stores rate data, and calculates payment fee estimates.",
    sections: [
      { heading: "How rates are selected", body: ["FeeClarity uses the recipient's country to choose the published PayPal fee schedule, then compares the sender's country to determine whether the transaction is domestic or international. The calculator separates base processing fees, international add-ons, fixed fees, and currency conversion estimates."] },
      { heading: "How exchange rates are handled", body: ["When payment and receiving currencies differ, the calculator can auto-fill a latest daily market reference rate from Frankfurter. This is not presented as PayPal's exact transaction exchange rate. Users can override the value manually, especially when PayPal shows a final exchange rate inside checkout or account screens."] },
      { heading: "How results are presented", body: ["Each calculator result shows the rate used, official source link, effective date, last verification date, assumptions, formula, and limitations. Unsupported payment types or unsupported domestic rules are blocked instead of estimated with invented data."] },
      { heading: "Review and corrections", body: ["FeeClarity is maintained by LaunchLab. Published fee values are reviewed against their linked provider sources and the verification date is recorded in the rate metadata and public rate log. When a source changes or a calculation appears incorrect, visitors can report the provider, market, effective date, official source URL, page URL, and non-sensitive inputs through the Contact page."] },
      { heading: "What this methodology does not claim", body: ["FeeClarity does not provide a live PayPal transaction quote, guarantee a final account-specific fee, or treat a market-reference exchange rate as PayPal's final rate. Estimates can differ because of account type, payment method, custom pricing, eligibility, and provider changes."] },
    ],
  },
  {
    path: "/rate-log/",
    title: "PayPal Fee Rate Log",
    description: "A transparency log for PayPal fee sources and FeeClarity calculator rate verification updates.",
    sections: [
      { heading: "Latest verification", body: ["FeeClarity last checked the implemented PayPal fee schedules on 2026-08-08 for the United States, Canada, United Kingdom, Australia, Philippines, and India. Each calculator result links to the official source used for that market."] },
      { heading: "Exchange-rate data", body: ["Latest daily market exchange rates are loaded from Frankfurter when available. These rates are used as reference inputs only and are not claimed to be PayPal's final transaction exchange rate."] },
      { heading: "Why this matters", body: ["Payment providers can update published pricing, fixed fees, eligible payment methods, currency conversion spreads, and international add-ons. A public rate log makes future updates easier to audit and helps users understand when a calculator result was last reviewed."] },
    ],
  },
  {
    path: "/paypal-vs-wise/",
    title: "PayPal vs Wise",
    description: "Compare PayPal and Wise for international payments, exchange rates, transaction fees, and recipient payouts.",
    sections: [
      { heading: "Compare the final recipient amount", body: ["PayPal and Wise can differ across processing fees, international charges, payout paths, and exchange-rate treatment. The most useful comparison is not the headline percentage; it is the final amount the recipient gets for the same payment route."] },
      { heading: "Where PayPal often fits", body: ["PayPal is commonly useful for ecommerce checkout, customer payments, invoices, and buyer familiarity. FeeClarity can estimate the PayPal side where verified country and transaction rules are implemented."] },
      { heading: "Where Wise often fits", body: ["Wise is commonly used for international transfers and multi-currency movement. FeeClarity does not currently include a verified Wise pricing engine, so users should compare against a current Wise quote for the exact amount, currency pair, and destination."] },
    ],
  },
  {
    path: "/paypal-vs-stripe/",
    title: "PayPal vs Stripe",
    description: "Compare PayPal and Stripe fee considerations for sellers, invoices, and online checkout.",
    sections: [
      { heading: "Different payment workflows", body: ["PayPal is often selected for buyer familiarity, PayPal account payments, invoices, and checkout options. Stripe is often selected for card-first checkout, developer-controlled payment flows, subscriptions, and platform payments. The right comparison starts with the payment workflow, not just the fee headline."] },
      { heading: "Fee categories to compare", body: ["For the same transaction, compare processing percentage, fixed fee, international card or cross-border treatment, currency conversion, chargeback handling, refund treatment, payout timing, and whether account-specific pricing applies."] },
      { heading: "When PayPal may be the practical choice", body: ["PayPal can be useful when customers expect a PayPal checkout option, when invoices are sent to clients who prefer PayPal, or when seller workflows already depend on PayPal account payments. The tradeoff is that fees can vary by product, country, currency, and account terms."] },
      { heading: "When Stripe may be the practical choice", body: ["Stripe may be useful for card-first checkout, software products, subscriptions, marketplaces, and custom payment flows. FeeClarity does not currently calculate Stripe rates, so Stripe pricing should be checked against Stripe's current published pricing and any account-specific terms."] },
      { heading: "How to compare without guessing", body: ["Run the PayPal estimate in FeeClarity for the exact amount, market, and currency. Then compare it with Stripe's current quote or pricing page for the same transaction details, including payout timing, chargeback exposure, refund handling, international treatment, and currency conversion."] },
      { heading: "What FeeClarity does not claim yet", body: ["FeeClarity does not currently include a verified Stripe pricing engine. This page should be used as a comparison checklist alongside the PayPal calculator and Stripe's current published pricing for your country and payment method."] },
    ],
  },
  {
    path: "/paypal-vs-payoneer/",
    title: "PayPal vs Payoneer",
    description: "Compare PayPal and Payoneer considerations for freelancers, businesses, and cross-border payments.",
    sections: [
      { heading: "Different cross-border use cases", body: ["PayPal is commonly used for client payments, invoices, online sales, and customer checkout. Payoneer is commonly considered for marketplace payouts, freelancer platforms, receiving accounts, and international business payments."] },
      { heading: "Costs to compare", body: ["Compare the payment receiving fee, currency conversion spread, withdrawal cost, payout timing, sender and recipient country support, marketplace rules, and whether the provider displays a route-specific quote before payment."] },
      { heading: "When PayPal may fit better", body: ["PayPal can be a better fit when the payer expects PayPal checkout, when invoices are already managed through PayPal, or when buyer familiarity matters more than payout routing. The final cost still depends on the selected PayPal transaction type and whether the payment is international."] },
      { heading: "When Payoneer may fit better", body: ["Payoneer may be considered for marketplace payouts, contractor payments, receiving accounts, and cross-border business workflows. FeeClarity does not currently calculate Payoneer pricing, so users should confirm a current Payoneer quote or published fee schedule for the exact route."] },
      { heading: "How to compare fairly", body: ["Compare the final amount available to withdraw, not only the advertised transaction fee. Include receiving charges, currency conversion, withdrawal costs, payout timing, supported currencies, account requirements, and whether the payer or marketplace controls the payment route."] },
      { heading: "What FeeClarity does not claim yet", body: ["FeeClarity does not currently include a verified Payoneer pricing engine. Use the PayPal calculator for the PayPal estimate, then compare it with Payoneer's current published pricing or quote for the exact route."] },
    ],
  },
  {
    path: "/sitemap/",
    title: "FeeClarity Sitemap",
    description: "Browse FeeClarity calculators, PayPal fee guides, country fee pages, comparisons, and transparency resources.",
    sections: [
      { heading: "Find every FeeClarity page", body: ["This sitemap helps visitors and search engines discover the main calculators, guides, country pages, comparison pages, and trust resources on FeeClarity."] },
    ],
  },
  {
    path: "/about/",
    title: "About FeeClarity",
    description: "FeeClarity is an independent payment-fee utility site built to make provider fees easier to estimate and understand.",
    sections: [
      { heading: "Who maintains FeeClarity", body: ["FeeClarity is maintained by LaunchLab as an independent web utility project. The site is built for freelancers, online sellers, creators, consultants, remote workers, and small businesses that need a clearer way to understand payment-fee estimates before sending or receiving money.", "LaunchLab is used as the public operator name so the site can be accountable without publishing unnecessary personal information. Visitors can contact the project through contact@tryfeeclarity.com for corrections, calculator issues, accessibility concerns, or provider expansion ideas."] },
      { heading: "Why FeeClarity was created", body: ["FeeClarity was created because payment fees are often harder to understand than they should be. A seller may see one headline percentage, a fixed fee in another place, an international charge in a separate rule, and a currency conversion cost hidden inside an exchange rate.", "The goal is to turn those pieces into a readable estimate that shows what changed, which assumptions were used, and where the source data came from. The calculator is meant to help people plan invoices, compare payment routes, and avoid being surprised by the amount they actually receive."] },
      { heading: "What makes the site different", body: ["FeeClarity is not a general blog page wrapped around a keyword. The main product is a working calculator with reverse calculation, international fee handling, currency conversion guidance, fee-line breakdowns, source links, verification dates, methodology notes, and unsupported-configuration warnings.", "The site keeps PayPal fee rules separate from the calculation engine so rate data can be reviewed, updated, and expanded without rewriting calculator logic. That structure also makes it possible to add future calculators for providers such as Wise, Stripe, Payoneer, Square, Shopify, Etsy, and eBay."] },
      { heading: "Who the site is for", body: ["FeeClarity is designed for people who need practical estimates before they price work, send invoices, accept customer payments, or compare international payment options. That includes freelancers quoting client work, ecommerce sellers checking margins, small businesses handling invoices, creators receiving payments, and consultants working with international clients.", "The site is especially useful when a payment involves more than one variable, such as sender country, recipient country, payment currency, receiving currency, transaction type, international status, or currency conversion."] },
      { heading: "Independent and source-led", body: ["FeeClarity is not affiliated with PayPal, Wise, Stripe, Payoneer, or any other payment provider mentioned on the site. Provider names are used only to identify services, fee schedules, comparison topics, and calculator inputs.", "Where FeeClarity displays actual PayPal fee values, the site links to published sources and shows source metadata such as effective dates and last verification dates. Unsupported markets or payment configurations should be labeled clearly rather than estimated from another country's pricing."] },
      { heading: "What FeeClarity publishes", body: ["FeeClarity publishes original calculators, fee explainers, country-specific PayPal fee notes, provider comparisons, methodology notes, rate-source transparency pages, privacy information, advertising policy notes, and contact guidance.", "Content is written to answer practical payment-fee questions instead of filling pages with repeated keyword text. Pages should help users calculate a fee, understand a specific scenario, compare decision factors, verify a source, or learn how FeeClarity handles uncertainty."] },
      { heading: "How content is reviewed", body: ["Published fee values are tied to source labels, effective dates, and verification dates where available. When a rule cannot be confidently verified, FeeClarity should label the limitation or block the estimate rather than substitute another market's pricing.", "Corrections are handled through the contact page. Useful correction reports include the provider, market, official source URL, effective date, page URL, and non-sensitive calculator inputs needed to reproduce the result."] },
      { heading: "How the site earns money", body: ["FeeClarity may earn revenue from advertising. Ads do not influence the fee rules, calculation methodology, source verification, unsupported-configuration decisions, warnings, page conclusions, or editorial coverage.", "The calculator and educational content are intended to remain the primary experience. Advertising should be clearly separated from calculator controls, forms, navigation, and calculation results."] },
    ],
  },
  {
    path: "/contact/",
    title: "Contact",
    description: "Contact FeeClarity about fee source updates, calculator issues, or provider expansion ideas.",
    sections: [
      { heading: "Contact email", body: ["Email FeeClarity at contact@tryfeeclarity.com for source corrections, calculator issues, accessibility concerns, policy questions, or provider expansion ideas."] },
      { heading: "Source corrections", body: ["If you notice a changed published fee schedule, include the provider, market, effective date, and official source URL when reaching out."] },
      { heading: "Advertising and privacy questions", body: ["For advertising, privacy, or consent-related questions, include the page URL and a short description of what you saw so the issue can be reviewed."] },
      { heading: "Calculator issue reports", body: ["If a calculation looks wrong, include the amount, sender country, recipient country, payment currency, receiving currency, transaction type, and whether international or currency conversion options were enabled. This helps reproduce the exact result."] },
      { heading: "What not to send", body: ["Do not send PayPal passwords, card numbers, bank account details, tax identifiers, private customer details, or screenshots containing sensitive payment information. FeeClarity only needs the non-sensitive calculator inputs and the public source link when reporting a fee issue."] },
      { heading: "Provider expansion ideas", body: ["FeeClarity is designed to expand beyond PayPal. Suggestions for Stripe, Wise, Payoneer, Square, Shopify, Etsy, eBay, or other provider calculators should include the provider, country, payment route, and official pricing source if available."] },
    ],
  },
  {
    path: "/editorial-policy/",
    title: "Editorial Policy",
    description: "How FeeClarity creates, reviews, and updates independent payment-fee calculator content.",
    sections: [
      { heading: "Original utility-first content", body: ["FeeClarity is built around original payment-fee calculators, practical examples, and plain-English explanations. Content is written to help users understand fees, assumptions, limitations, and source dates rather than to fill pages with keywords."] },
      { heading: "Source verification", body: ["When a calculator uses published PayPal fee values, the result links to the official source and shows a verification date. Unsupported rates are labeled or blocked rather than estimated from another market's pricing."] },
      { heading: "How low-value content is avoided", body: ["FeeClarity avoids publishing pages that exist only to target a keyword. Pages should either provide a useful calculator, explain a specific fee scenario, compare decision factors, document methodology, or help users verify the source behind an estimate."] },
      { heading: "Examples and assumptions", body: ["Examples are written with stated assumptions instead of universal promises. A fee example should identify the amount, market, transaction type, currency, international status, and conversion assumptions when those details affect the result."] },
      { heading: "Updates and corrections", body: ["Payment providers can change rates, fixed fees, supported countries, and currency conversion terms. FeeClarity maintains a rate log and welcomes source corrections through the contact page."] },
      { heading: "Independence", body: ["FeeClarity is not affiliated with PayPal, Wise, Stripe, Payoneer, or other payment providers mentioned on the site. Provider names are used only to identify the services being discussed."] },
    ],
  },
  {
    path: "/advertising-policy/",
    title: "Advertising Policy",
    description: "How FeeClarity handles advertising, ad placement, and independence from editorial calculator content.",
    sections: [
      { heading: "Advertising approach", body: ["FeeClarity may display advertising to support free access to its calculators and guides. Ads are placed away from primary calculator controls and should not be designed to look like navigation, download buttons, forms, or calculator results."] },
      { heading: "Editorial independence", body: ["Advertising does not influence FeeClarity's fee rules, source verification, calculator methodology, warnings, or unsupported-configuration decisions."] },
      { heading: "User experience standards", body: ["FeeClarity avoids pop-ups, pop-unders, misleading ad labels, forced downloads, and layouts where ads outweigh useful content. The calculator and educational content remain the primary page experience."] },
      { heading: "Ad placement during review", body: ["While advertising approval is being reviewed, FeeClarity may keep visible ad placements minimal so users and reviewers see complete utility content rather than empty ad boxes. Approved ads should remain secondary to the calculator and source-backed educational content."] },
      { heading: "Policy compliance", body: ["FeeClarity is designed to follow Google AdSense and Google Publisher policy expectations, including original content, clear navigation, transparent About and Contact pages, and responsible ad implementation."] },
    ],
  },
  {
    path: "/privacy/",
    title: "Privacy",
    description: "Privacy information for FeeClarity.",
    sections: [
      {
        heading: "Calculator inputs",
        body: [
          "FeeClarity is designed so calculations can run in your browser. Calculator inputs are used to estimate fees and should not include sensitive payment account credentials, card numbers, tax identifiers, or private customer information.",
          "Analytics hooks are event-based and should avoid collecting sensitive payment details. Advertising code may be used to connect the site to an advertising provider for review and, if approved, to display ads.",
        ],
      },
      {
        heading: "Analytics and usage measurement",
        body: [
          "FeeClarity uses Google Analytics to understand which pages and calculators are useful, how visitors navigate the site, and where improvements are needed. Calculator analytics should be limited to general usage events and should not intentionally collect sensitive payment account details.",
          "Analytics data helps improve page quality, accessibility, mobile usability, and calculator clarity. Users should still avoid entering private account information because the calculators only need scenario details such as amount, country, currency, and transaction type.",
        ],
      },
      {
        heading: "Advertising cookies and third-party vendors",
        body: [
          "If FeeClarity displays Google AdSense or other advertising in the future, third-party vendors, including Google, may use cookies, web beacons, IP addresses, or similar technologies to serve ads, measure ad performance, limit repeated ads, and help show ads based on prior visits to this site or other websites.",
          "Google's use of advertising cookies enables Google and its partners to serve ads to users based on visits to FeeClarity and/or other sites on the Internet. Users can opt out of personalized advertising through Google's Ads Settings. Users may also be able to opt out of some third-party vendors' personalized advertising through industry opt-out tools such as aboutads.info where available.",
        ],
      },
      {
        heading: "Contact and corrections",
        body: [
          "Visitors can contact FeeClarity at contact@tryfeeclarity.com for privacy questions, accessibility issues, source corrections, or calculator problems. Reports should include the page URL and non-sensitive details needed to reproduce the issue.",
        ],
      },
      {
        heading: "Consent and regional privacy choices",
        body: [
          "Visitors from regions with cookie-consent or privacy-choice requirements may be shown additional controls before personalized advertising or similar technologies are used. FeeClarity should be configured to respect applicable consent, opt-out, and data-processing rules before live ad tags are enabled.",
        ],
      },
    ],
  },
  {
    path: "/terms/",
    title: "Terms",
    description: "Terms and disclaimer for using FeeClarity calculators.",
    sections: [
      { heading: "Estimates only", body: ["FeeClarity provides educational estimates, not financial, legal, tax, or accounting advice. Confirm final fees with the payment provider before relying on a calculation."] },
      { heading: "No provider affiliation", body: ["FeeClarity is independent and is not affiliated with, endorsed by, sponsored by, or operated by PayPal or any other payment provider mentioned on the site. Provider names are used only to identify fee schedules, calculators, and comparison topics."] },
      { heading: "Your responsibility", body: ["You are responsible for confirming the final fee, exchange rate, payment method, country eligibility, account-specific pricing, and tax or accounting treatment before sending an invoice, changing pricing, or completing a transaction."] },
      { heading: "Calculator inputs", body: ["Do not enter sensitive information such as passwords, card numbers, bank details, tax identifiers, or private customer information. The calculators are designed for non-sensitive payment scenario inputs such as amount, country, currency, and transaction type."] },
      { heading: "Source and update limitations", body: ["FeeClarity links to published sources where verified fee data is used, but provider pricing can change. A rate shown on FeeClarity may differ from the final rate shown in your account because of custom pricing, funding source, account type, currency conversion, product eligibility, or other transaction details."] },
    ],
  },
];

export function getPage(path: string) {
  return contentPages.find((page) => page.path === path);
}
