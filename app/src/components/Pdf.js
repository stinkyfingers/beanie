import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';


// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#E4E4E4',
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
    height: 300,
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: '1px'
  },
  image: {
    width: 150,
    height: 150
  },
  text: {
    backgroundColor: '#ddd',
    marginVertical: '2px',
  },
  field: {
    fontSize: 11
  }
});

const Pdf = ({beanies, title, token}) => {

  const renderViews = () => {
    if (!beanies) return null;
    const views = [];
    for (const beanie of beanies) {

      let src = beanie.image && beanie.image.includes('http') ? beanie.image : null;
      if (beanie.image && beanie.image.includes('data:image/jpeg;base64')) {
        const data =  Buffer.from(beanie.image.split('data:image/jpeg;base64,')[1], 'utf8');
        src = {data, format: 'jpeg'}
      }

      views.push(
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
          {src ?
            <Image src={src} style={styles.image}/>: <Text>No Image</Text>
          }
        </View>
      )
    }
    return views;
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
