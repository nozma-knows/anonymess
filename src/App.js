import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { DataStore } from '@aws-amplify/datastore';
import { Message } from './models';
import {v4 as uuid} from 'uuid';
import moment from 'moment';

const { TextArea } = Input
const initialState = {
  title: '',
  entry: '',
}

function App() {
  
  const [formState, updateFormState] = useState(initialState)
  const [messages, updateMessages] = useState([])

  // Calls fetchMessages on first render. Subscribes to changes in DataStore and updates messages Hook accordingly
  useEffect(() => {
    fetchMessages()
    const subscription = DataStore
      .observe(Message)
      .subscribe(() => fetchMessages())
    return () => subscription.unsubscribe()
  }, [])


  // Updates messages Hook with contents of DataStore
  async function fetchMessages() {
    const messages = await DataStore.query(Message)
    updateMessages(messages)
  }

  // Creates new message from form inputs and adds the new message to DataStore
  async function createMessage() {
    console.log('Form State: ', formState)
    console.log('Messages: ', messages[0].title)
    if (!formState.entry) return // Exit function if Entry field is empty
    await DataStore.save(new Message({ id: uuid(), title: formState.title, entry: formState.entry, createdAt: moment().format('L - h:mm:ss a')})) // Save contents of form as a message in DataStore
    updateFormState(initialState) // Reset Form to inital state
  }

  async function deleteMessage(id) {
    console.log('ID to delete: ', id)
    await DataStore.delete(Message, message => message.id("eq", id))
    fetchMessages()
  }

  // Handles updates to form state
  function handleChange(e) {
    updateFormState({ ...formState, [e.target.name] : e.target.value })
  }

  return (
    <div style={styles.secretMessageContainer}>
      <div style={styles.secretMessageHeader}>anonymess</div>
      <div style={styles.secretMessageDescription}>real time anonymess message board</div>
      <TextArea 
        onChange={handleChange}
        name="title"
        placeholder="Title"
        autoSize={{ minRows: 1, maxRows: 2 }}
        value={formState.title}
        style={styles.input}
      />
      <TextArea 
        onChange={handleChange}
        name="entry"
        placeholder="Entry"
        autoSize={{ minRows: 4, maxRows: 10 }}
        value={formState.entry}
        style={styles.input}
      />
      <Button
        type="primary"
        onClick={createMessage}
        style={{display: 'flex', alignSelf: 'center', marginBottom: 20}}
      >
        Enter Message
      </Button>
      {
        [...messages.slice(0,1)].map(message => (
          <div style={styles.messageContainer}>
            <div
              key={message.id}
              style={{...styles.messageStyle, backgroundColor: 'black'}}
            >
              <div style={{paddingBottom: 10, color: 'white'}}>{message.createdAt.toUpperCase()}</div>
              <div style={{...styles.messageTitle, color: 'white', borderColor: 'white'}}>{message.title}</div>
              <div style={{...styles.messageEntry, color: 'white'}}>{message.entry}</div>
            </div>
            {/* <Button
              type="default"
              onClick={() => deleteMessage(message.id)}
            >
              Delete
            </Button> */}
          </div>
        ))
      }
      {
        [...messages.slice(1)].reverse().map(message => (
          <div style={styles.messageContainer}>
            <div
              key={message.id}
              style={styles.messageStyle}
            >
              <div style={{paddingBottom: 10}}>{message.createdAt.toUpperCase()}</div>
              <div style={styles.messageTitle}>{message.title}</div>
              <div style={styles.messageEntry}>{message.entry}</div>
            </div>
            {/* <Button
              type="default"
              onClick={() => deleteMessage(message.id)}
            >
              Delete
            </Button> */}
          </div>
        ))
      }
    </div>
  );
}

export default App;

const styles = {
  secretMessageContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
  },
  secretMessageHeader: {
    display: 'flex',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Righteous',
    // backgroundColor: 'green',
    fontWeight: 'normal',
    fontSize: 60
  },
  secretMessageDescription: {
    alignSelf: 'center', 
    textAlign: 'center', 
    marginBottom: 10,
    fontSize: 15,
  },
  input: {
    marginBottom: 10
  },
  messageContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageStyle: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    // backgroundColor: 'green',
    padding: 10,
    margin: 10,
    borderStyle: 'solid',
    borderWidth: 3,
    borderRadius: 5,
  },
  messageTitle: {
    display: 'flex',
    padding: 5,
    margin: 2,
    borderBottom: 'medium solid #000000'
    // borderStyle: 'solid',
    // borderWidth: 2,
    // borderRadius: 5,
  },
  messageEntry: {
    padding: 5,
    margin: 2,
    marginTop: 10,
  }
}