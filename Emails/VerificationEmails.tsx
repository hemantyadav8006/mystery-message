import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Container,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here's your verification code: 😉</Preview>
      <Container style={containerStyle}>
        <Section style={headerStyle}>
          <Heading as="h1" style={headerTextStyle}>
            Welcome to Mystery Message | True Feedback
          </Heading>
        </Section>

        <Section style={contentStyle}>
          <Row>
            <Heading as="h2" style={greetingStyle}>
              Hello {username},
            </Heading>
          </Row>
          <Row>
            <Text style={textStyle}>
              Thank you for registering! Please use the following verification
              code to complete your registration:
            </Text>
          </Row>
          <Row>
            <Text style={otpStyle}>{otp}</Text>
          </Row>
          <Row>
            <Text style={textStyle}>
              If you did not request this code, please ignore this email.
            </Text>
          </Row>
          <Row>
            <Button
              href={`http://localhost:3000/verify/${username}`}
              style={buttonStyle}
            >
              Verify Now
            </Button>
          </Row>
        </Section>

        <Section style={footerStyle}>
          <Text style={footerTextStyle}>
            &copy; 2025 Mystery Message | True Feedback. All rights reserved.
          </Text>
          <Text style={footerTextStyle}>
            Need help? Contact us at hemantyadav8006@gmail.com
          </Text>
        </Section>
      </Container>
    </Html>
  );
}

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#f4f4f7",
  padding: "20px",
};

const headerStyle = {
  backgroundColor: "#1e40af",
  padding: "20px",
  textAlign: "center" as const,
  borderRadius: "8px 8px 0 0",
};

const headerTextStyle = {
  color: "#ffffff",
  fontSize: "24px",
  margin: "0",
};

const contentStyle = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "0 0 8px 8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const greetingStyle = {
  fontSize: "20px",
  color: "#111827",
  margin: "0 0 20px 0",
};

const textStyle = {
  fontSize: "16px",
  color: "#374151",
  lineHeight: "24px",
  margin: "10px 0",
};

const otpStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1e40af",
  textAlign: "center" as const,
  margin: "20px 0",
  letterSpacing: "2px",
};

const buttonStyle = {
  backgroundColor: "#1e40af",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "500",
  textAlign: "center" as const,
  display: "inline-block",
  margin: "20px auto",
  textDecoration: "none",
};

const footerStyle = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const footerTextStyle = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "5px 0",
};
