import { useEffect, useState } from 'react';
import { Offcanvas, ListGroup } from 'react-bootstrap';
import { getAllUser } from '@api/user';

export default function SwitchUserCanvas({
  show,
  currentUser,
  switchUser,
  onClose,
}) {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState();

  useEffect(() => {
    getAllUser().then((data) => {
      setUsers(data.user);
    });
    setMe(JSON.parse(localStorage.getItem('user')));
  }, []);

  return (
    <Offcanvas show={show} onHide={onClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Switch FileSystem</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <ListGroup variant="flush">
          {users.map((user) => (
            <ListGroup.Item
              action
              onClick={() => switchUser(user)}
              active={currentUser.id === user.id}
              key={user.id}
            >
              {user.name + (me && me.id === user.id ? '(me)' : '')}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
