import { Container, Table, Row, Button, Col } from 'react-bootstrap';
import { Header, FileTableRow } from '@components'
import { useEffect, useState } from 'react';
import { getFileTree } from '@api/file';


export default function FileViewPage() {

    const [tree, setTree] = useState();
    const [displayedFiles, setDisplayedFiles] = useState();

    useEffect(() => {
        getFileTree().then((data) => {
            setTree({
                path: [data.name],
                files: data
            })
        });
    }, [])

    useEffect(() => {
        if (tree) {
            let files = [];
            let currentDir = tree.files;
            for (let i = 1; i < tree.path.length; i++) {
                if (currentDir.directories) {
                    currentDir = currentDir.directories.find(dir => dir.name === tree.path[i]);
                }
            }
            files.push({
                fileName: ".",
                fileType: "directories",
                permissions: currentDir.metadata.perms,
                updatedAt: currentDir.metadata.updatedAt
            })
            files = files.concat(currentDir.directories.map((dir) => {
                return {
                    fileName: dir.name,
                    fileType: "directory",
                    permissions: dir.metadata.perms,
                    updatedAt: dir.metadata.updatedAt
                }
            }))
            files = files.concat(currentDir.files.map((file) => {
                return {
                    fileName: file.name,
                    fileType: "file",
                    permissions: file.metadata.perms,
                    updatedAt: file.metadata.updatedAt
                }
            }))
            console.log(files)
            setDisplayedFiles(files)
        }
    }, [tree])




    return <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Header style={{ width: 50 }} username={"Boyan Sun"}></Header>
        <Row>
            <Col className='m-3'><h1>{"Boyan Sun" + "'s FileSystem"}</h1></Col>
            <Col md="auto" className='m-3'>
                <Button>AddFile</Button>
            </Col>
        </Row>
        <Container fluid style={{ height: 'calc(100vh - 100px)' }}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>File Name</th>
                        <th>File Type</th>
                        <th>Permission</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        displayedFiles ? displayedFiles.map((file) => {
                            return <FileTableRow {...file}></FileTableRow>
                        }) : <></>
                    }
                </tbody>
            </Table>
        </Container>
    </div>
}