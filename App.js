import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Header, Input, Button, Icon, ListItem } from 'react-native-elements';

const db = SQLite.openDatabase('coursedb.db');

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [slist, setSList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, product text, amount text);');
    });
    updateList();    
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into shoppinglist (product, amount) values (?, ?);', [product, amount]);    
      }, null, updateList, setProduct(''), setAmount('')
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) =>
        setSList(rows._array)
      ); 
    });
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shoppinglist where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  renderItem= ({ item }) => (
    <ListItem 
      bottomDivider>
    <ListItem.Content>
        <ListItem.Title>{item.product} </ListItem.Title>
        <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
        
      </ListItem.Content><Icon name='delete' color='red' size={30} onPress={()=> deleteItem(item.id)}/>
    </ListItem>)
    

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'SHOPPING LIST', style: {color: '#fff'}}}
      />
      <Input placeholder='Product' label='PRODUCT'
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <Input placeholder='Amount' label='AMOUNT'
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button raised icon={{name: 'save', color: 'white'}} onPress={saveItem} title="SAVE" /> 
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem= {renderItem}
        data={slist}
      />      
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  marginTop: '5%',
 },
});