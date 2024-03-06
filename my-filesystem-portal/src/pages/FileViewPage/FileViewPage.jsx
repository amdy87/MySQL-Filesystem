import { Container, Table } from 'react-bootstrap';
import { Header } from '../../components'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';


export default function FileViewPage() {

    const [files, setFiles] = useState();

    useEffect(() => {
        let temp = [];
        for(let i = 0;i < 100;i++){
            temp.push({
                id: i,
                type: "directory",
                permission: "",
                name: "folder" + i,
                updatedAt: new Date(),
                selected: false
            })
        }
        setFiles(temp);
    }, [])




    return <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Header style={{ width: 50 }} username={"Boyan Sun"}></Header>
        <div>
            
        </div>
        <Container fluid style={{ height: 'calc(100vh - 100px)' }}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th></th>
                        <th>File Name</th>
                        <th>File Type</th>
                        <th>Permission</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </Table>
        </Container>
    </div>
}