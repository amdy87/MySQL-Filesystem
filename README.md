# Requirements and Specification Document

## Team Name

MyFilesystem

## Project Abstract


This project will implement a MySQL-based filesystem that will allow users to manage their files like they would in the file system in a typical operating system. Using React, Express, and Prisma with MySQL as the underlying storage layer, it will provide a web interface for users to create, read, update and delete files, directories or subdirectories. They will be able to view any associated file metadata (e.g. permissions, size, last updated). Users will be required to log in and will only be ablet o view/update files that they have the required permissions for. Additionally, using the web interface, users will be able to visualize all directories and files in the file system in a tree structure.

## Customer

<!--A brief description of the customer for this software, both in general (the population who might eventually use such a system) and specifically for this document (the customer(s) who informed this document). Every project will have a customer from the CS506 instructional staff. Requirements should not be derived simply from discussion among team members. Ideally your customer should not only talk to you about requirements but also be excited later in the semester to use the system.-->
The customers for this software are the CS506 instructional staff and people needing/desiring a web based file system.

### User Requirements

<!--This section lists the behavior that the users see. This information needs to be presented in a logical, organized fashion. It is most helpful if this section is organized in outline form: a bullet list of major topics (e.g., one for each kind of user, or each major piece of system functionality) each with some number of subtopics.-->


| ID   | Description                                                  | Priority | Status |
| ---- | ------------------------------------------------------------ | -------- | ------ |
| **R01**  |  The system will permit users to create new files and directories within directories they have write permissions to. |  high  | Open   |
| **R02**  |  The system will permit users to delete files and directories that they have write permissions for. |  high   | Open   |
| **R03**  | The system will provide an interface that enables moving a file or directory that is within a directory a users has write access to another directory that they have write access to within their filesystem. |   high   | Open   |
| **R04**  |  The sytem will provide an interface for users to rename files and directories that they have write access to. |  medium     | Open   |
| **R05**  | In order for the system to allow a user access a filesystem, a user must login to an account that has access to the filesystem and include the Bearer Token they receive from login in subsequent requests. |  high    | Open   |
| **R06**  | The system will display the contents of a file that a user has read permissions to when the name of that file is clicked on in the "tree-display" page. |   high   | Open   |
| **R07**  | The system will provide a login page for users to access their account using a username and password. |   high   | Done   |
| **R08**  | The system will provide an interface for users to log out of an account, terminating their authenticated session. |   high   | Open   |
| **R09**  | The system will not allow any user to read files they don't have read permission for, write to file they don't have write permission for, or read, write, or view any file metadata that is contained within a directory that the user doesn't have read permission for.|  high    | Open   |
| **R10**  | The system will provide an interface to users for editing the contents of a file they have write permission for (add and delete text). |   low   | Open   |
| **R11**  | The system will display metadata--read, write, and execute permissions, time when the file was created, and time the file was last updated--about all files and directories that are within directories that a user has read access to. |   medium   | Open   |
| **R12**  | The system will permit users must be able to edit the metadata of all files and directories that they own.|  medium    | Open   |
| **R13**  | The system must be able to meet the designated speed and capacity performance requirements  |   high   | Open   |
| **R14**  | The system will be able to handle file uploads for both empty and non-empty files. |  medium    | Open   |
| **R15**  | The system must be able to display the files and directories within a given directory alphabetically by filename (ascending and descending). |   low   | Open   |
| **R16**  | The system must store securely store sensitive information, including but not limited to, the names of the users, user passwords, file contents and metadata, and application secrets. |   high   | Open   |
| **R17**  | The system will provide an inteface for renaming a top-level file system. |   low   | Open   |
| **R18**  | The system will provide an interface for deletion of user accounts that displays a button to each user that allows them to delete only their account. |   medium   | Open   |
| **R19**  | Documentation about how the system is designed by shall be contained in the README.md file stored on GitLab.  |  high    | Open   |

### User Stories

<!--Use cases and user stories that support the user requirements in the previous section. The use cases should be based off user stories. Every major scenario should be represented by a use case, and every use case should say something not already illustrated by the other use cases. Diagrams (such as sequence charts) are encouraged. Ask the customer what are the most important use cases to implement by the deadline. You can have a total ordering, or mark use cases with “must have,” “useful,” or “optional.” For each use case you may list one or more concrete acceptance tests (concrete scenarios that the customer will try to see if the use case is implemented).-->


##### File Creation

(U01)
> To add a file, I press the “add” button and the file creation dialog appears

(U02)
> I select file type from file creation dialog, and I am prompted to name the file

(U03)
> To finish the creation, I press “confirm” button

(U04)
> To cancel the creation, I press the “cancel” button

##### File Deletion

(U05)
> To delete a file or directory, I select the file or directory and press delete, file is moved to “recently deleted” directory

##### File Updating

(U06)
> To update a file, I select the file and right click, and am prompted with the update file options dialog

##### File Reading
(U07)
> To open a file, I double click on it or press the open button while it is selected and the contents of that file are displayed on the screen.

(U08)
> Once file is open, To edit the file's contents I hit the edit button and can now make basic edits to the file's contents.

(U09)
> If the file can not be displayed/opened, the system will display an error message.

##### File Metadata
(U10)
> To view the metadata of a file, I select it and right click to display the "options" dialog.

(U11)
> When the "options" dialog is open, I click the properties button and the "properties" dialog appears displaying the metadata of the file.

(U38)
> To edit the metadata I press the edit button on the options dialog

(U39)
> After making the edits I press the confirm button to save my edits to the metadata

(U40)
> I press the cancel button to discard any changes I made

##### Navigation

(U12)
> To change directories, I double-click the directory that I want to move to in the directory tree, and the new directory is opened up and displayed

(U13)
> When a directory is selected or the arrow attached to it is clicked, the directory tree should display the files and directories it contains beneath it in the tree.

(U14)
> When a directory is selected and its contents are already displayed in the tree, the contents should no longer be displayed in the tree.

##### Login

(U15)
> When the webpage is loaded, login page appears and I am prompted to enter a username and password

(U16)
> Once my username and password are entered, I then press the “login” button to login

(U17)
> If my login credentials are incorrect the system will display an error message and I will be prompted to enter the info again.

##### User Creation

(U18)
> To create a new user, I press “create new user” button on login page and the “Create New User” page is shown

(U19)
> On the “Create New User” page, I am prompted to enter a username, password, and to re-enter the password;

(U20)
> To complete user creation, I press the confirm button and I am logged into the service

(U21) 
> If the credentials I entered are not allowed, the system displays an error message.

##### File Import
(U23) 
> To import a file, I select the import button and the import file dialog is displayed.

(U24) 
>I drag the desired file into the window or search for it using the access file dialog and it is imported into the current directory.

##### File Renaming
(U25)
> To rename a file, I press the "rename file" button when the file is selected and am prompted with the "rename file" dialog

(U26)
> I enter the new file name into the entry box and press confirm to rename a file

(U27)
> To cancel file renaming, I press the cancel button in the "rename file" dialog

##### logout
(U28)
> To logout, I press the logout button on the homepage and am prompted with the "confirm logout" dialog

(U29)
> I press the confirm button on the confirm logout dialog to logout or the cancel button to return to the homepage


##### File sorting
(U30)
> To sort the files alphabetically descending, I press the sort button

(U31)
> To sort the files alphabetically ascending, I press the sort button after the files are sorted alphabetically descending

##### Project Documentation
(U32)
> To understand how the system works, I access the project README.md file 

##### File System Renaming
(U33)
> To rename the file system, I press the edit file system name button next to the file system name and I am prompted with the rename file system dialog

(U34)
> In the rename file system dialog, I enter the new name into the prompt and press confirm to rename the file system or cancel to return

##### Account Deletion
(U35)
> To delete my account, I press the delete account button

(U36)
> I am prompted with the confirm account deletion dialog

(U37)
> I press the confirm button on the account deletion dialog to delete my account or the cancel button to return

### Use Cases

- User wants to add a file (U01 - U04)
- User wants to delete a file (U05)
- User wants to update a file (U06)
- User wants to view the contents of a file (U07 - U09)
- User wants to view the metadata of a file (U10, U11)
- User wants to change the directory they are in or view what a directory holds (U12 - U14)
- User wants to login to a file system (U15, U16)
- User wants to create a new account (U18-U21)
- User wants to export a file (U22)
- User wants to import a new file to the system (U23-U24)

### User-Requirements Traceability
| Requirements  | User stories |
| ------------  | ------------ |
| [R01](#user-requirements) | [U01-U04](#file-creation)  |
| [R02](#user-requirements) | [U05](#file-deletion)  |
| [R04](#user-requirements) | [U25-U27](#file-renaming) |
| [R03](#user-requirements) | [U12-U14](#navigation)  |
| [R05](#user-requirements) | [U18-U21](#user-creation)|
| [R06](#user-requirements) | [Style](#user-interface-requirements) |
| [R07](#user-requirements) | [U15-U17](#login)|
| [R08](#user-requirements) | [U27-U28](#logout) |
| [R09](#user-requirements) | [Permissions Class](#class-diagram) |
| [R10](#user-requirements) | [U07-U09](#file-reading) |
| [R11](#user-requirements) | [U10-U11](#file-metadata) |
| [R12](#user-requirements) | [U38-U40](#file-metadata) |
| [R13](#user-requirements) | [System Requirements](#system-requirements) |
| [R14](#user-requirements) | [U23-U24](#file-import) |
| [R15](#user-requirements) | [U30-U31](#file-sorting) |
| [R16](#user-requirements) | [Security](#security-requirements) |
| [R17](#user-requirements) | [U33-U34](#file-system-renaming) |
| [R18](#user-requirements) | [U35-U37](#account-deletion) |
| [R19](#user-requirements) | [U32](#project-documentation) |



### User Interface Requirements

<!--Describes any customer user interface requirements including graphical user interface requirements as well as data exchange format requirements. This also should include necessary reporting and other forms of human readable input and output. This should focus on how the feature or product and user interact to create the desired workflow. Describing your intended interface as “easy” or “intuitive” will get you nowhere unless it is accompanied by details.-->

<!--NOTE: Please include illustrations or screenshots of what your user interface would look like -- even if they’re rough -- and interleave it with your description.-->

- Login page
- User creation page
- Tree-like display of the file system
- Window to display file contents
- Top of screen navigation bar
- Dialogs to guide users through use cases as necessary
- File types are handled correctly
- Navigation changes display

**Style**

![style](Resources/mainPageDesign.png)

### Security Requirements

<!--Discuss what security requirements are necessary and why. Are there privacy or confidentiality issues? Is your system vulnerable to denial-of-service attacks?-->

- Only users having the permission to create/read/update/delete a file can do so
- User input (i.e. the modifications they make to the file system) is sanitized before storing files in the database
- User passwords are salted and hashed to comply with modern security standards
- Use HTTPS for secure communication
- Comprehensive logging to ensure the system is functioning as intended

### System Requirements

<!--List here all of the external entities, other than users, on which your system will depend. For example, if your system inter-operates with sendmail, or if you will depend on Apache for the web server, or if you must target both Unix and Windows, list those requirements here. List also memory requirements, performance/speed requirements, data capacity requirements, if applicable.-->

- Linux machine on which to run Docker
- 4 GB RAM
- Guaranteed p90 response times
    - LOGIN - 5 seconds
    - CREATE file/directory - 3 seconds
    - UPDATE file/directory - 3 seconds
    - DELETE file/directory - 3 seconds
    - READ tree view - 4 seconds
    - READ individual file view - 3 seconds
- Supports 100+ separate filesystems with 100 files with a filesize of 1MB on average

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
        int id PK
        string name
        string email
        string password "Hashed/Encrypted"
        string role "ADMIN/USER"
    }

    Permission {
        int permission_id PK
        int name
        int description
    }

    File {
        int file_id PK
        int user_id FK
        int parent_dir_id FK
        int file_permission_id FK
        string created_at
        string updated_at
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
        int dir_permission_id FK
        string created_at
        string updated_at
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
title: Class Diagram for Our Program
---
classDiagram

    class User{
        - String name
        - int id
        - String role
        - String email
        - String password
        + String getName()
        + String getEmail()
        + int getId()
        + String getRole()
        + void setRole(String role)
        + void setEmail(String email)
        + void setPhone(String phone)
        + void setPassword(String prev_pw, String new_pw)

    }
    class File {
        - String name
        - int id
        - Directory parent
        - String path
        - int[] file_permission_ids
        - createdAt
        - updatedAt
        + File(String name)
        + void setName(String name)
        + String getName()
        + int getId()
        + String getParent()
        + String getPath()
        + int[] getFilePermissionIds()
        + String getCreatedDate()
        + String getUpdatedDate()
    }

    class Directory {
        - String name
        - int id
        - int user_id
        - Directory parent
        - String path
        - createdAt
        - updatedAt
        - int[] dir_permissions_ids
        + Directory(String name)
        + void setName(String name)
        + String getName()
        + int getId()
        + String getParent()
        + String getPath()
        + int[] getDirPermissionIds()
        + String getCreatedDate()
        + String getUpdatedDate()
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

# Code Standards

This document outlined the code standard for writing our project: MySQL-based Filesystem. The project uses JavaScript and React.js on the frontend and Typescript with Express.js and Prisma on the backend. 

### Naming Conventions

- **Components:** Use PascalCase for React components and hooks. For example, `<UserProfile />` in `UserProfile.js`.
- **Classes:** Use PascalCase. For example, `SomeKlass`.
- **Files:** Use camelCase for all files that do not export React components. For example, `userProfileHelpers.js`.
- **Methods & Variables:** Use camelCase for methods and variables. For instance, `getUserData`.
- **Constants:** Use all uppercase and separate words by underscore. For example, `SOME_CONSTANT`.

## Frontend standards

[Structure](#structure)

[State Management](#state-management)

[Styling](#styling)

### Structure
- src/
    - components/: reusable components without state.
        - sample/: page directory 
            - sample.js: actual component 
            - sample.test.js: test file for the component
        - index.js: file for exporting all components
    - containers/: a single use container with states that possibly contain multiple components.
    - pages/: a single page.
        - sample/: page directory 
            - sample.js: actual page view
            - sample.test.js: test file for the page
    - utils/: helper functions and constants.
        - constans/: contains directory
        - helper/: helper function directory
    - api/: API calls.
    - stores/: Global state store using Redux
    - assets/: Static assets like images and icons.

### State Management

- Prefer local state management with hooks (`useState`, `useReducer`) for simple state logic.
- Use context (`useContext`) for global state management or when passing props deeply.
- Use Redux for complex applications.

### Styling
- Use React Bootstrap to keep project styling consistent.
- Keep styling props minimal and use class names for static style.
- Use [prettier](https://prettier.io/) for automatic code formatting

### Testing
- Write unit tests for components using React Testing Library and Vitest.
- Test both the UI and interaction logic.
- Each file will have associated unit test files
- Maintain above 60% coverage
- GUI will be tested manually to ensure correct functionality and desired appearance

# Backend Standards

### Directory Structure
- `/database`
    - `/test` -> contains all database integration tests
    - `query.ts` -> contains all Prisma Queries
    - `sample.ts` -> contains example data for database tests
- `/middlewares` -> contains all Express middleware (e.g. user authentication middleware)
- `/routes` -> contains express routers that define available routes and delegate them to the appropriate controller
- `/controllers` -> contains all controllers, which serve as a layer to implement business logic between the routers and the database
- `/test` -> contains all Jest tests for the backend API
- `/utils` -> contains type definitions, environment variables, and helper functions


### Source File Structure
Files consist of the following, in order:

1. JSDoc with `@fileoverview`
2. Imports
3. The file’s implementation

### `@fileoverview` JSDoc
A file must have a @fileoverview JSDoc to provide a description of the file's content.

```
/**
 * @fileoverview Description of file
 */
```

### Styling
- Use [prettier](https://prettier.io/) for automatic code formatting

### Testing
- Test that the API returns the expected response and that everything we need is being pulled from the database using the Jest testing framework.
- Maintain above 60% coverage
- Each file will have associated unit test files for automated Testing
