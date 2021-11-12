# Anonymess

# Descrtiption

Anonymess is a real-time anonymous message board. Users can enter a message (title and entry), that message is saved to the cloud and rendered to the website in real time.

## Front-End

The front end for Anonymess is writen in Javascript using the React library. The interface of this web application is a form for writing to an AWS DynamoDB database using a GraphQL API. Entries saved in the database are read and displayed to the screen from newest to oldest and cannot be deleted.

## Back-End

The back end for Anonymess is written in Javascript and set up using the AWS CLI (Amazon Web Services Command Line Interface). The back end consits of a GraphQL API that connects a DynamoDB database hosted by AWS and made accessible by the AWS console.
