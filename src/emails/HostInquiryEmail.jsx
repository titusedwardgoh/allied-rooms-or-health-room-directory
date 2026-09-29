import { Heading, Link, Section, Text } from "@react-email/components";
import EmailShell from "@/emails/EmailShell";
import {
  bodyText,
  card,
  cardLabel,
  cardOnWhite,
  heading,
  infoLine,
  link,
  note,
} from "@/emails/theme";

export default function HostInquiryEmail({
  roomTitle,
  senderName,
  senderEmail,
  senderPhone,
  message,
}) {
  return (
    <EmailShell preview={`New practitioner inquiry for ${roomTitle}`}>
      <Heading style={heading}>New listing inquiry</Heading>
      <Text style={bodyText}>
        A practitioner is interested in leasing <strong>{roomTitle}</strong>.
      </Text>

      <Section style={card}>
        <Text style={cardLabel}>Practitioner</Text>
        <Text style={infoLine}>
          <strong>Name:</strong> {senderName}
        </Text>
        <Text style={infoLine}>
          <strong>Email:</strong>{" "}
          <Link href={`mailto:${senderEmail}`} style={link}>
            {senderEmail}
          </Link>
        </Text>
        {senderPhone ? (
          <Text style={infoLine}>
            <strong>Phone:</strong> {senderPhone}
          </Text>
        ) : null}
      </Section>

      <Section style={cardOnWhite}>
        <Text style={cardLabel}>Message</Text>
        <Text
          style={{
            ...infoLine,
            margin: "0",
            whiteSpace: "pre-wrap",
          }}
        >
          {message}
        </Text>
      </Section>

      <Text style={note}>
        Reply to this email to respond to {senderName}.
      </Text>
    </EmailShell>
  );
}
