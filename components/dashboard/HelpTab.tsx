"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpTab() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Help & Support</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>How do I update my profile?</AccordionTrigger>
          <AccordionContent>
            You can update your profile information in the Profile tab. Click on the edit button to make changes.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do I update my payment method?</AccordionTrigger>
          <AccordionContent>
            Go to the Financial tab and enter your new card information. We use secure encryption to protect your data.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Need help or have questions?</AccordionTrigger>
          <AccordionContent>
            Our support team is available 24/7 to assist you. You can reach us anytime via email at{" "}
            <a href="mailto:support@nb1.ai" className="text-blue-400 hover:text-blue-300">
              support@nb1.ai
            </a>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

