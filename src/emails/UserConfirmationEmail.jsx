import { Button, Heading, Link, Section, Text } from "@react-email/components";
import EmailShell from "@/emails/EmailShell";
import {
  bodyText,
  button,
  buttonWrap,
  card,
  cardLabel,
  heading,
  infoLine,
  link,
} from "@/emails/theme";

export default function UserConfirmationEmail({
  senderName,
  roomTitle,
  practiceName,
  hostEmail,
  listingUrl,
}) {
  return (
    <EmailShell preview={`Your inquiry for ${roomTitle} was sent`}>
      <Heading style={heading}>Inquiry sent</Heading>
      <Text style={bodyText}>
        Hi {senderName}, your message about <strong>{roomTitle}</strong> has
        been sent to <strong>{practiceName}</strong>.
      </Text>

      <Section style={card}>
        <Text style={cardLabel}>Clinic email</Text>
        <Text style={infoLine}>
          <Link href={`mailto:${hostEmail}`} style={link}>
            {hostEmail}
          </Link>
        </Text>
        <Text style={{ ...infoLine, color: "#78716c", margin: "8px 0 0" }}>
          The clinic will reply if they can offer the days you need. You can
          also email them directly from this message.
        </Text>
      </Section>

      {listingUrl ? (
        <Section style={buttonWrap}>
          <Button href={listingUrl} style={button}>
            View listing
          </Button>
        </Section>
      ) : null}
    </EmailShell>
  );
}
