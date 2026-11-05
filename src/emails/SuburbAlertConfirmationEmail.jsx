import { Button, Heading, Section, Text } from "@react-email/components";
import EmailShell from "@/emails/EmailShell";
import {
  bodyText,
  button,
  buttonWrap,
  card,
  cardLabel,
  heading,
  infoLine,
} from "@/emails/theme";

export default function SuburbAlertConfirmationEmail({
  suburbName,
  daysLabel,
  hubUrl,
}) {
  return (
    <EmailShell preview={`You're on the ${suburbName} room list`}>
      <Heading style={heading}>You're on the list</Heading>
      <Text style={bodyText}>
        Thanks for joining the AlliedRooms early-access list for sessional rooms
        in <strong>{suburbName}</strong>.
      </Text>

      <Section style={card}>
        <Text style={cardLabel}>Your alert</Text>
        <Text style={infoLine}>
          <strong>Suburb:</strong> {suburbName}
        </Text>
        <Text style={infoLine}>
          <strong>Preferred days:</strong> {daysLabel}
        </Text>
      </Section>

      <Text style={bodyText}>
        This email confirms we have your address on file. When we email this
        list about new rooms in {suburbName}, it will come here. Reply if you
        want to be removed.
      </Text>

      {hubUrl ? (
        <Section style={buttonWrap}>
          <Button href={hubUrl} style={button}>
            View {suburbName} rooms
          </Button>
        </Section>
      ) : null}
    </EmailShell>
  );
}
