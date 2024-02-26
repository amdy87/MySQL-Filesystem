# Requirements and Specification Document

## Team Name

<!--The name of your team.-->

## Project Abstract


This project will implement a MySQL-based filesystem that will allow users to manage their files like they would in the file system in a typical operating system. Using React, Express, and Prisma with MySQL as the underlying storage layer, it will provide a web interface for users to create, read, update and delete files, directories or subdirectories. They will be able to view any associated file metadata (e.g. permissions, size, last updated). Users will be required to log in and will only be ablet o view/update files that they have the required permissions for. Additionally, using the web interface, users will be able to visualize all directories and files in the file system in a tree structure.

## Customer

<!--A brief description of the customer for this software, both in general (the population who might eventually use such a system) and specifically for this document (the customer(s) who informed this document). Every project will have a customer from the CS506 instructional staff. Requirements should not be derived simply from discussion among team members. Ideally your customer should not only talk to you about requirements but also be excited later in the semester to use the system.-->

### User Requirements

<!--This section lists the behavior that the users see. This information needs to be presented in a logical, organized fashion. It is most helpful if this section is organized in outline form: a bullet list of major topics (e.g., one for each kind of user, or each major piece of system functionality) each with some number of subtopics.-->

Here is a user requirements sample from [Crookshanks](https://learning-oreilly-com.ezproxy.library.wisc.edu/library/view/practical-software-development/9781484206201/9781484206218_Ch02.xhtml):

| ID   | Description                                                  | Priority | Status |
| ---- | ------------------------------------------------------------ | -------- | ------ |
| R11  | Users should not have to sign into the system; their current network login should be used for identification. | Med      | Done   |
| R12  | The user should pick a project first; the tasks available are a derivative of the project. | High     | Open   |
| R13  | A full-time employee should not be able to submit a time card with less than 40 hours per week recorded. | High     | Open   |
| R14  | A contractor can submit any number of hours up to 60 without special approval. | Med      | Open   |
| R15  | A team lead can see his/her team's time cards before they are submitted but cannot approve them until the user submits it. | High     | Open   |

<div align="center"><small><i>Excerpt from Crookshanks Table 2-2 showing example user requirements for a timekeeping system</i></small></div>

- You 
  - Can
    - Use
- Bullet
  - Points
    - In
    - Markdown

### Use Cases & User Stories

<!--Use cases and user stories that support the user requirements in the previous section. The use cases should be based off user stories. Every major scenario should be represented by a use case, and every use case should say something not already illustrated by the other use cases. Diagrams (such as sequence charts) are encouraged. Ask the customer what are the most important use cases to implement by the deadline. You can have a total ordering, or mark use cases with “must have,” “useful,” or “optional.” For each use case you may list one or more concrete acceptance tests (concrete scenarios that the customer will try to see if the use case is implemented).-->

Here is a sample user story from [Clean Agile](https://learning-oreilly-com.ezproxy.library.wisc.edu/library/view/clean-agile-back/9780135782002/ch03.xhtml#ch03lev1sec1) using a markdown block quote:

> As the driver of a car, in order to increase my velocity, I will press my foot harder on the accelerator pedal.

1. You
   1. Can
      1. Also
2. Use
   1. Numbered
      1. Lists

### User Interface Requirements

<!--Describes any customer user interface requirements including graphical user interface requirements as well as data exchange format requirements. This also should include necessary reporting and other forms of human readable input and output. This should focus on how the feature or product and user interact to create the desired workflow. Describing your intended interface as “easy” or “intuitive” will get you nowhere unless it is accompanied by details.-->

<!--NOTE: Please include illustrations or screenshots of what your user interface would look like -- even if they’re rough -- and interleave it with your description.-->

Images can be included with `![alt_text](image_path)`

### Security Requirements

<!--Discuss what security requirements are necessary and why. Are there privacy or confidentiality issues? Is your system vulnerable to denial-of-service attacks?-->

### System Requirements

<!--List here all of the external entities, other than users, on which your system will depend. For example, if your system inter-operates with sendmail, or if you will depend on Apache for the web server, or if you must target both Unix and Windows, list those requirements here. List also memory requirements, performance/speed requirements, data capacity requirements, if applicable.-->

| You    |    can    |    also |
| ------ | :-------: | ------: |
| change |    how    | columns |
| are    | justified |         |

## Specification

<!--A detailed specification of the system. UML, or other diagrams, such as finite automata, or other appropriate specification formalisms, are encouraged over natural language.-->

<!--Include sections, for example, illustrating the database architecture (with, for example, an ERD).-->

<!--Included below are some sample diagrams, including some example tech stack diagrams.-->

<!-- You can make headings at different levels by writing `# Heading` with the number of `#` corresponding to the heading level (e.g. `## h2`). -->

#### Technology Stack


```mermaid
flowchart RL
subgraph Front End
	A("Javascript: React (to be changed)")
end
	
subgraph Back End
	B(TypeScript: Express)
end
	
subgraph Database
	C[(MySQL)]
end

A <-->|"REST API"| B
B <--> C
```


#### Database
[Mermaid ER Diagram Notaton Documentation](https://mermaid.js.org/syntax/entityRelationshipDiagram.html)
```mermaid
---
title: Database ERD for an SQL-Based File System
---

erDiagram
    User ||--o{ File : "Creates"
    User ||--o{ Directory: "Creates"
    User ||--o{ Permission: "Creates"
    Directory ||--o{ File : "contains"
    File ||--o{ File_Content : "contains"
    Permission ||--|{ File_Permission: ""
    Permission ||--|{ Directory_Permission: ""
    File_Permission }|--|{ File: ""
    Directory_Permission }|--|{ Directory: ""

    User {
        int user_id PK
        string name
        string email
        string phone
        string password "Hashed/Encrypted"
    }

    Permission {
        int permission_id PK
        int name
        int description
    }

    File {
        int file_id PK
        int user_id FK
        int permission_id FK
        string created_date
        string updated_date
        string content_type
        int file_size
        string file_path
    }
    File_Permission {
        int file_permission_id PK
        int file_id FK
        int user_id FK
        int permission_id FK
    }
    
    Directory_Permission {
        int dir_permission_id PK
        int dir_id FK
        int user_id FK
        int permission_id FK
    }

    Directory {
        int dir_id PK
        int parent_dir_id FK
        int user_id FK
        int permission_id FK
        string name
    }

    File_Content {
        int file_content_id PK
        int file_id FK
        string content
    }



```

#### Class Diagram

```mermaid
---
title: Class Diagram for Animal Program
---
classDiagram

    class User{
        - String name
        - int id
        - String email
        - String phone
        - String password

    }
    class File {
        - String name
        - int id
        - Directory parent
        - String path
        - int[] file_permission_ids
        + File(String name)
        + void setName(String name)
        + String getName()
        + int getId()
        + String getParent()
        + String getPath()
        + int[] getFilePermissionIds()
    }

    class Directory {
        - String name
        - int id
        - int user_id
        - Directory parent
        - String path
        - int[] dir_permissions_ids
        + Directory(String name)
        + void setName(String name)
        + String getName()
        + int getId()
        + String getParent()
        + String getPath()
        + int[] getDirPermissionIds()
    }

    class Permission {
        - String name
        - int id
        - String path
        + Permission(String name)
        + void setName(String name)
        + String getName()
        + int getId()
    }
   
```

<!-- 
classDiagram
    class Animal {
        - String name
        + Animal(String name)
        + void setName(String name)
        + String getName()
        + void makeSound()
    }
    class Dog {
        + Dog(String name)
        + void makeSound()
    }
    class Cat {
        + Cat(String name)
        + void makeSound()
    }
    class Bird {
        + Bird(String name)
        + void makeSound()
    }
    Animal <|-- Dog
    Animal <|-- Cat
    Animal <|-- Bird -->

#### Flowchart

```mermaid
---
title: Program Flowchart
---
graph TD;
    Start([Start]) --> User_Auth[/User Login/ Signup/];
    User_Auth --> Input_Query[Process Query];
    Input_Query --> Validate_Query{Validate Query};
    Validate_Query -->|Valid| Process_Valid_Query[Process Valid Query];
    Validate_Query -->|Invalid| Error_Message[/Error Message/];
    Process_Valid_Query --> Display_File_Structure[Display File Structure];
    Display_File_Structure --> End([End]);
    Error_Message --> End;
```

#### Sequence Diagram

```mermaid
sequenceDiagram

participant React Frontend
participant Express Backend
participant MySQL DB

React Frontend ->> Express Backend: HTTP Request (e.g., POST /file)
activate Express Backend

Express Backend ->> MySQL DB: Query (e.g., INSERT INTO files ...)
activate MySQL DB

MySQL DB -->> Express Backend: Query Result
deactivate MySQL DB

Express Backend -->> React Frontend: Status Code (e.g. 201 Created)
deactivate Express Backend
```

### Standards & Conventions

<!--Here you can document your coding standards and conventions. This includes decisions about naming, style guides, etc.-->
