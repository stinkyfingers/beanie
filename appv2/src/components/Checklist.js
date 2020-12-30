import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    flexDirection: 'column',
    flexWrap: 'wrap',
    margin: 20
  },
  row: {
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    width: 20,
    height: 20
  },
  box: {
    width: 10
  },
  name: {
    width: 200
  },
  animal: {
    width: 200
  },
  field: {
    fontSize: 11
  }
});

const Checklist = ({ family, title, beanies }) => {
  const renderViews = () => {
    if (!beanies) return null;
    return beanies.map(beanie =>
        <View key={beanie.name} style={styles.row} wrap={false}>
          <Text wrap={true} style={styles.box}>
            _
          </Text>
          <Text wrap={true} style={styles.name}>
            Name: <Text wrap={true} style={styles.field}>{beanie.name}</Text>
          </Text>
          <Text wrap={true} style={styles.animal}>
            Animal: <Text wrap={true} style={styles.field}>{beanie.animal}</Text>
          </Text>
          { beanie.thumbnail ? <Image src={beanie.thumbnail} style={styles.image}/> : null}
        </View>
      );
    };

  return (
    <Document title={`${title}: ${family}`}>
      <Page size="A4" style={styles.page} wrap={true}>
        {renderViews()}
      </Page>
    </Document>
  );
};

export default Checklist;
