import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';


// Create styles
const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  view: {
    display: 'flex',
    flexGrow: 1,
    padding: 20,
    textAlign: 'left',
    width: 200,
    borderStyle: 'solid',
    borderColor: '#aaa',
    borderWidth: '1',
    margin: '4'
  },
  image: {
    width: 50,
    height: 50
  },
  noimage: {
    width: 50,
    height: 50,
    color: '#aaa'
  },
  text: {
    marginVertical: '2px',
    color: '#aaa'
  },
  field: {
    color: '#000'
  }
});

const Pdf = ({ beanies, title }) => {
  const renderViews = () => {
    if (!beanies) return null;
    return beanies.map(beanie =>
      <View key={beanie.name} style={styles.view} wrap={false}>
        <Text wrap={true} style={styles.text}>
          Name: <Text wrap={true} style={styles.field}>{beanie.name}</Text>
        </Text>
        <Text wrap={true} style={styles.text}>
          Animal: <Text wrap={true} style={styles.field}>{beanie.animal}</Text>
        </Text>
        <Text wrap={true} style={styles.text}>
          Family: <Text wrap={true} style={styles.field}>{beanie.family}</Text>
        </Text>
        <Text wrap={true} style={styles.text}>
          Variety: <Text wrap={true} style={styles.field}>{beanie.variety}</Text>
        </Text>
        <Text wrap={true} style={styles.text}>
          Exclusive To: <Text wrap={true} style={styles.field}>{beanie.exclusiveTo}</Text>
        </Text>
        <Text wrap={true} style={styles.text}>
          Birthday: <Text wrap={true} style={styles.field}>{beanie.birthday}</Text>
        </Text>
        <Text wrap={true} style={styles.text}>
          Intro Date: <Text wrap={true} style={styles.field}>{beanie.introDate}</Text>
        </Text>
        <Text wrap={true} style={styles.text}>
          Retire Date: <Text wrap={true} style={styles.field}>{beanie.retireDate}</Text>
        </Text>
        <Text wrap={true} style={styles.text}>
          Height: <Text wrap={true} style={styles.field}>{beanie.height}</Text>
        </Text>
        <Text wrap={true} style={styles.text}>
          Length: <Text wrap={true} style={styles.field}>{beanie.length}</Text>
        </Text>
        <Text wrap={true} style={styles.text}>
          Tag Text: <Text wrap={true} style={styles.field}>{beanie.tt}</Text>
        </Text>
        <Text wrap={true} style={styles.text}>
          Sticker Text: <Text wrap={true} style={styles.field}>{beanie.st}</Text>
        </Text>
        {beanie.thumbnail ?
          <Image src={beanie.thumbnail} style={styles.image}/>: <Text style={styles.noimage}/>
        }
      </View>
    );
  }
  return (
    <Document title={title}>
      <Page size="A4" style={styles.page} wrap={true}>
        {renderViews()}
      </Page>
    </Document>
  );
};

export default Pdf;
