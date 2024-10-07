'use client'

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { MyContext } from '../../Context/MyContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../@/components/ui/alert-dialog"
import { Button } from "../../../@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card"
import { Loader2, Mail, MessageSquare, Phone, Trash2 } from "lucide-react"

export default function ContactsPage() {
  const [error, setError] = useState(null)
  const { SERVER_URL_V,contacts,setContacts} = useContext(MyContext)


  const DeleteMessage = async (id) => {
    try {
      await axios.delete(`${SERVER_URL_V}/contacts/${id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
        }
      })
      setContacts(contacts.filter(contact => contact._id !== id))
    } catch (err) {
      setError(err)
    }
  }


  if (error) return (
    <div className="flex justify-center items-center h-screen text-red-500">
      <p>Error: {error.message}</p>
    </div>
  )

  return (
    <section>
      <Card className=" md:hidden">
        <div className="grid gap-4 grid-cols-1">
          {contacts.map((contact) => (
            <Card key={contact._id} className="p-3">
              <div className="flex flex-col space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">ID: {contact.iduser}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" className="h-6 w-6">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the contact.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => DeleteMessage(contact._id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{contact.phoneNumber}</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-1">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      View Message
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Message</AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="max-h-60 overflow-y-auto">{contact.message}</div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
    </Card>
    <Card className="w-full md:block sm:hidden hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell className="font-medium">{contact.iduser}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {contact.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {contact.phoneNumber}
                  </div>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">View Message</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Message</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className="max-h-72 overflow-y-auto">{contact.message}</div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the contact.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => DeleteMessage(contact._id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </section>
    
  )
}