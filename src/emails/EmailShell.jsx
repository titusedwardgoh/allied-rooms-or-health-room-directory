import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { container, footer, hr, logo, main } from "@/emails/theme";

export default function EmailShell({ preview, children }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>AlliedRooms</Text>
          {children}
          <Hr style={hr} />
          <Text style={footer}>
            Sessional rooms for allied health · Melbourne
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
