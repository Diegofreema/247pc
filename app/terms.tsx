import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import NavigationHeader from '../components/NavigationHeader';
import Container from '../components/Container';
import { Text } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import {
  BoldText,
  NormalText,
  NumberedText,
  NumberedTextBold,
  TitleText,
} from '../components/NormalText';
import Pdf from 'react-native-pdf';
type Props = {};

const terms = (props: Props) => {
  return (
    <Container style={{ backgroundColor: 'white' }}>
      <NavigationHeader back title="Terms of service agreement" />
      <View style={styles.container}>
        <Pdf
          source={{
            uri: 'https://247pharmacy.net/TERMS_OF_SERVICE_AGREEMENT_BETWEEN_NETPRO_AND_HEALTH_CARE_SERVICE_PROVIDERS_v04.10.23.pdf',
            cache: true,
          }}
          trustAllCerts={false}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      </View>
    </Container>
  );

  //   return (
  //     <Container>
  //       <NavigationHeader back title="Terms of service agreement" />
  //       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
  //         <BoldText>
  //           TERMS OF SERVICE OF HEALTH CARE SERVICE PROVIDERS AND NETPRO
  //           INTERNATIONAL LIMITED
  //         </BoldText>
  //         <NormalText>
  //           These terms and conditions constitute a legally binding agreement
  //           (hereinafter referred to as "Agreement"), made between:
  //         </NormalText>
  //         <TitleText
  //           heading="Healthcare Service Provider(s)"
  //           text=' defined herein after and referred to as ("Practitioner" or
  //           "Practitioners" or "You") which expression shall be deemed to mean and
  //           include his/her/their heirs, successors, executors, administrators,
  //           and legal representatives as the case may be,'
  //         />
  //         <Text
  //           style={{
  //             color: 'black',
  //             fontSize: 15,
  //             marginBottom: 10,
  //             fontWeight: 'bold',
  //           }}
  //         >
  //           AND
  //         </Text>
  //         <TitleText
  //           heading={'Netpro International Limited'}
  //           text="(hereinafter referred to as ‘Us” , “We “ , “Our” ) which expression shall mean and
  //           include its successors and assigns; and concerning your access to 247pharmacy.net and use of the practitioner
  //           services provided on its sister platform, the 247Doc.net and all related mobile and web applications, as well as any
  //          service content and data available via them (collectively the “services” or “the websites”). "
  //         />
  //         <NormalText>
  //           Please read the terms and conditions carefully before using or
  //           accessing the websites or any material or information therein for the
  //           purpose of providing Services through 247doc.net. You agree that by
  //           accessing the Services, you have read, understood, and agreed to be
  //           bound by all of these Legal Terms.
  //         </NormalText>
  //         <View style={{ marginBottom: 20 }} />
  //         <NumberedTextBold number="1." text="ACCEPTANCE OF TERMS" bold />
  //         <NumberedTextBold
  //           number="1.1."
  //           text='This Agreement applies to all healthcare professionals (including but not limited to Medical Doctors,
  //     Pharmacists, Mental health specialists and Natural Health experts) who wish to list themselves as
  //     "Practitioners" on 247doc.net and governs the practitioner’s access to and use of any Practitioner    Services
  //         provided on the websites.'
  //         />

  //         <NumberedTextBold
  //           number="1.2."
  //           text='By accepting or clicking the tab/button "I agree" at the time of registration or by mere use of the
  // Practitioner Services provided on 247Doc.net, the Practitioner shall be deemed to be bound by this
  // agreement, and to have read and understood and unconditionally accepted this Agreement in its entirety. '
  //         />
  //         <NumberedTextBold
  //           number="1.3."
  //           text="The Practitioner accepts that Netpro International Limited is the owner, author and publisher of the
  // websites and the operator of the Systems associated with 247pharmacy.net and 247doc.net for providing
  // practitioner Services."
  //         />
  //         <NumberedTextBold
  //           number="1.4."
  //           text='By using the 247doc.net or accessing any material, information or services through the website, the
  // Practitioner agrees, admits, confirms and declares that the Practitioner has fully read and understood these
  // Terms and Conditions (also referred to as "Terms of Practitioner&apos;s Use") as set forth in this Agreement,
  // without any impairment in judgment resulting from (but not limited to) mental illness, mental handicap,
  // intoxication, medication, or any other health or other problem that could impair judgment.'
  //         />
  //         <NumberedTextBold
  //           number="1.5."
  //           text="By listing and registering as a Practitioner on 247doc.net, or by mere use of or access to 247doc.net, you
  // shall be contracting with Netpro International Limited, and these terms and conditions constitute your
  // binding obligation and you agree and declare that you intend to use the Practitioner Services offered on
  // 247Doc.net on your own volition, free will, without any undue influence, force or coercion, while in sound
  // and disposing mind and your being legally capable of contracting in law."
  //         />
  //         <View style={{ marginBottom: 30 }} />
  //         <NumberedTextBold number="2." text="DEFINITIONS" bold />
  //         <NormalText>
  //           The following words and terms, whenever used in this Agreement, unless
  //           repugnant to the meaning or context thereof, shall have the respective
  //           meanings set forth below.
  //         </NormalText>
  //         <NumberedText
  //           number="2.1."
  //           text="shall mean any applicable national, federal, state or local laws (both
  // common law and statute law and civil and criminal law) and all applicable subordinate legislation
  // Page 2 of 12
  // and regulatory codes of practice (including statutory instruments, guidance notes, circulars,
  // directives, decisions, regulations, treaties, conventions, ordinances, order of any government
  // agency, requirement or recommendation of any statute, statutory instrument, by-law or any public,
  // governmental or statutory authority or person); all being of the Federal Republic of Nigeria."
  //           heading='"Applicable Laws" or "Law" '
  //         />
  //         <NumberedText
  //           number="2.2."
  //           text=" shall mean and include Netpro International Limited, its Offices, Officers,
  // Directors, Partners, Owners, Administrator, independent Contractors, Employees, Agents or affiliates,
  // and its/their successors and assigns."
  //           heading='"Us" or "We" or “our”,'
  //         />
  //         <NumberedText
  //           number="2.3."
  //           text=" shall mean and include all registered and unregistered
  // trademarks, copyright in all forms including but not limited to the contents of the websites, images,
  // text, illustrations, audio clips, trademarks, logos, labels, video clips, software and coding; industrial
  // designs, patents, inventions, domain names, trade secrets, methodology, processes, features,
  // functionality, User Information and common law rights in the aforesaid, which are associated with
  // Netpro International Limited, Services or the Systems."
  //           heading='"Intellectual Property Rights",'
  //         />
  //         <NumberedText
  //           number="2.4."
  //           text=" shall mean a person, and includes any individual, corporation, firm, partnership, joint
  // venture, association, organization, trust, state or Governmental Authority or other legal entity (in
  // each case, whether or not having separate legal personality). Medical Doctors, Pharmacists, Mental
  // health specialists and Natural health experts"
  //           heading='"Person"'
  //         />
  //         <NumberedText
  //           number="2.5."
  //           text=" shall mean and include medical health professional(s), and/or
  // doctors, pharmacists, mental health specialists, Natural health experts and other health care service
  // providers registered and listed on the websites."
  //           heading='"Practitioner" or "Practitioners"'
  //         />
  //         <NumberedText
  //           number="2.6."
  //           text=" shall mean and include your name, email address, mobile
  // number, password, date of birth, gender, registration number, and certain other sensitive personal
  // information collected by Netpro International Limited or any other information required by Netpro
  // International Limited for creation of the Practitioner Account.
  // "
  //           heading='"Practitioner Account Information" '
  //         />
  //         <NumberedText
  //           number="2.7."
  //           text=", shall mean and include, but not limited to the following services made
  // available by Netpro International Limited on the 247doc.net website and System:"
  //           heading='"Practitioner Services" '
  //         />

  //         <NumberedTextBold
  //           number="2.7.1"
  //           text="Manage Practice Services: (a) Integrated calendar for booking and managing Online Consultations
  // and Clinic Visits, (b) Maintaining electronic medical records of patient visits, (c) Invoicing and
  // payment, (d) SMS and email notifications to patients and User and (e) Other services which are
  // ancillary to the area of Manage Practice."
  //         />
  //         <NumberedText
  //           number="2.8"
  //           heading='"Services"'
  //           text=" shall mean and include any service(s), including User Services and Practitioner Services,
  // provided by Netpro International Limited through its websites and Systems."
  //         />
  //         <NumberedText
  //           number="2.9"
  //           heading='"Website&apos;s"'
  //           text="  shall mean and include, whole or in part, the internet resource and websites known as
  // 247pharmacy.net and its sister platform, 247doc.net including but not limited to all its associated
  // sub-domains, mobile applications any accompanying or associated data, applications, utilities or
  // interface."
  //         />
  //         <NumberedText
  //           number="2.10"
  //           heading='"Systems"'
  //           text=" shall mean and include the websites, electronic communication network including all
  // software, all hardware, all files and images and data contained in or generated by the Systems
  // associated with the websites."
  //         />
  //         <NumberedText
  //           number="2.11"
  //           heading='"Territory"'
  //           text=" shall mean and include only the territorial jurisdiction of the Federal Republic of Nigeria,
  // to the exclusion of all other countries and territories of the world."
  //         />
  //         <NumberedText
  //           number="2.11"
  //           heading='"Use" '
  //           text=" shall mean and include any use of the websites or Services by a Person, including without
  // limitation, Practitioner and/or the Workforce (interns, employees, servants, affiliates, representatives,
  // agents, independent contractors employed or hired) of the Practitioner."
  //         />
  //         <NumberedText
  //           number="2.12"
  //           heading='"User" and "Users"'
  //           text=" shall mean and include a registered user, unregistered user, or any Person
  // who uses the websites, including the patient and his relative(s), representatives, agents, servants or
  // affiliates, for whom or on whose behalf, the User is using the Site."
  //         />
  //       </ScrollView>
  //     </Container>
  //   );
};

export default terms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
