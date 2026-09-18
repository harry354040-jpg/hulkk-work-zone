import { GYM_INFO } from '../data/gymInfo';

/**
 * Hulk's Work Zone - WhatsApp Membership Enquiry Utility
 * Generates pre-filled WhatsApp click-to-chat URLs with dynamic plan names
 * and optional user details (Name, Goal, Plan) from the existing flow.
 *
 * Contact Number: 8770506113 (Country code 91 for India)
 */

export const GYM_WHATSAPP_NUMBER = '918770506113';

export interface WhatsAppEnquiryDetails {
  planName?: string;
  name?: string;
  goal?: string;
  timing?: string;
  notes?: string;
}

/**
 * Builds the natural, professional WhatsApp message.
 * Incorporates the selected membership plan dynamically.
 */
export const buildMembershipWhatsAppMessage = ({
  planName,
  name,
  goal,
  timing,
  notes,
}: WhatsAppEnquiryDetails = {}): string => {
  const selectedPlan = planName?.trim() || 'Gym Membership';

  // Format plan phrasing dynamically and naturally
  let planPhrase = selectedPlan;
  const lower = selectedPlan.toLowerCase();

  if (
    lower.includes('visitor') ||
    lower.includes('visit') ||
    lower.includes('consultation')
  ) {
    planPhrase = selectedPlan;
  } else if (!lower.includes('plan') && !lower.includes('membership')) {
    planPhrase = `${selectedPlan} membership plan`;
  } else if (!lower.includes('plan')) {
    planPhrase = `${selectedPlan} plan`;
  }

  const lines: string[] = ["Hello Hulk's Work Zone,"];

  if (name?.trim()) {
    lines.push(`My name is ${name.trim()}.`);
  }

  lines.push(`I am interested in the ${planPhrase}. Please share the details and joining process.`);

  if (goal?.trim()) {
    lines.push(`My goal is: ${goal.trim()}`);
  }

  if (timing?.trim()) {
    lines.push(`Preferred timing: ${timing.trim()}`);
  }

  if (notes?.trim()) {
    lines.push(`Note: ${notes.trim()}`);
  }

  lines.push('Thank you.');

  return lines.join('\n\n');
};

/**
 * Constructs the URL-encoded WhatsApp click-to-chat link.
 * Uses official wa.me Universal Link for native mobile and desktop support.
 */
export const getMembershipWhatsAppUrl = (
  details?: string | WhatsAppEnquiryDetails
): string => {
  const params: WhatsAppEnquiryDetails =
    typeof details === 'string' ? { planName: details } : details || {};

  const message = buildMembershipWhatsAppMessage(params);
  const encodedText = encodeURIComponent(message);

  return `https://wa.me/${GYM_WHATSAPP_NUMBER}?text=${encodedText}`;
};

/**
 * Direct WhatsApp trigger.
 * Opens the WhatsApp app on mobile devices or WhatsApp Web on desktop with pre-filled message.
 * The user reviews the message and clicks Send manually.
 */
export const openWhatsAppMembershipEnquiry = (
  details?: string | WhatsAppEnquiryDetails
) => {
  const url = getMembershipWhatsAppUrl(details);

  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch {
    window.location.href = url;
  }
};
