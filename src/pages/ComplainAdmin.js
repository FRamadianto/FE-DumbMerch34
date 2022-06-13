// import useContext hook
import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import NavbarAdmin from '../components/NavbarAdmin'

import Contact from '../components/complain/Contact'
// import chat component 
import Chat from '../components/complain/Chat'

// import user context
import { UserContext } from '../context/userContext'

// import socket.io-client 
import {io} from 'socket.io-client'

// initial variable outside socket
let socket
export default function ComplainAdmin() {
    const [contact, setContact] = useState(null)//data contact yang di klik
    const [contacts, setContacts] = useState([])//data contact dari server
    // create messages state
    const [messages, setMessages] = useState([])

    const title = "Complain admin";
    document.title = title;

    // consume user context
    const [state] = useContext(UserContext)

    useEffect(() =>{
        socket = io("https://backendfikri34.herokuapp.com/" || 'http://localhost:5000', {//ketika dimounting akan mengisikan socket dan memunculkan
            auth: {                           //client connect
                token: localStorage.getItem('token')//kirim ke backend line 17
            },
            query: {
                id: state.user.id//send query at server Scket,query.id
            }
        })

        // define listener for every updated message
        socket.on("new message", () => {
            console.log("contact", contact)
            socket.emit("load messages", contact?.id)
        })

        loadContacts()//pemanggilan function agar dieksekusi
        loadMessages()

        return () => {
            socket.disconnect()//ketika return maka proses unmount langsung ditulis karena sudah ada nilai default 
            //untk diconnect dan connection di server
        }
    }, [messages])//menambahkan perubahan dari messagesnya

    const loadContacts = () => {
        socket.emit("load customer contacts")//perintah ke server untuk on load cstmr cntct di server
        socket.on("customer contacts", (data) => {
            // filter just customers which have sent a message
            let dataContacts = data.filter(item => (item.status !== "admin") && (item.recipientMessage.length > 0 || item.senderMessage.length > 0))
            
            // manipulate customers to add message property with the newest message
            dataContacts = dataContacts.map((item) => ({
                ...item,
                message: item.senderMessage.length > 0 ? item.senderMessage[item.senderMessage.length -1].message : "Click here to start message"
            }))
            setContacts(dataContacts)
        })
    }

    // used for active style when click contact
    const onClickContact = (data) => {
        setContact(data)
        // emit event load messages
        socket.emit("load messages", data.id)
    }

    const loadMessages = (value) => {
        // define listener on event "messages"
        socket.on("messages", (data) => {
            // get data messages
            if (data.length > 0) {
                const dataMessages = data.map((item) => ({
                    idSender: item.sender.id,
                    message: item.message,
                }))
                setMessages(dataMessages)
            }
            loadContacts()
            const chatMessagesElm = document.getElementById("chat-messages");
            chatMessagesElm.scrollTop = chatMessagesElm?.scrollHeight;
        })
    }

    const onSendMessage = (e) => {
        // listen only enter key event press
        if(e.key === 'Enter') {
            const data = {
                idRecipient: contact.id,//dari kontak yang diklik
                message: e.target.value
            }

            //emit event send message
            socket.emit("send message", data)
            e.target.value = ""
        }
    }

    return (
        <>
            <NavbarAdmin title={title} />
            <Container fluid style={{height: '89.5vh'}}>
                <Row>
                    <Col md={3} style={{height: '89.5vh'}} className="px-3 border-end border-dark overflow-auto">
                        <Contact dataContact={contacts} clickContact={onClickContact} contact={contact}/>
                    </Col>
                    <Col md={9} style={{maxHeight: '89.5vh'}} className="px-0">
                        <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
