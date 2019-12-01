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
    height: 300
  },
  image: {
    width: 150,
    height: 150
  }
});

const Pdf = ({beanies = [], title}) => {
  const renderViews = () => {
    if (!beanies) return null;
    const views = [];
    for (const beanie of beanies) {

      let src = beanie.image && beanie.image.includes('http') ? beanie.image : null;
      if (beanie.image && beanie.image.includes('data:image/jpeg;base64')) {
        const data =  Buffer.from(beanie.image.split('data:image/jpeg;base64,')[1], 'utf8');
        console.log(data)
        src = {data, format: 'jpg'}
      }
      views.push(
        <View key={beanie.name} style={styles.view} wrap={false}>
          <Text wrap={true}>
            Name: {beanie.name}
          </Text>
          <Text wrap={true}>
            Animal: {beanie.animal}
          </Text>
          <Text wrap={true}>
            Family: {beanie.family}
          </Text>
          <Text wrap={true}>
            Variety: {beanie.variety}
          </Text>
          <Text wrap={true}>
            Exclusive To: {beanie.exclusiveTo}
          </Text><Text wrap={true}>
            Birthday: {beanie.birthday}
          </Text>
          <Text wrap={true}>
            Intro Date: {beanie.introDate}
          </Text>
          <Text wrap={true}>
            Retire Date: {beanie.retireDate}
          </Text>
          <Text wrap={true}>
            Height: {beanie.height}
          </Text>
          <Text wrap={true}>
            Length: {beanie.length}
          </Text>
          <Text wrap={true}>
            Tag Text: {beanie.tt}
          </Text>
          <Text wrap={true}>
            Sticker Text: {beanie.st}
          </Text>
          {src ?
            <Image src={src} style={styles.image}/> : null
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
