import { Button } from 'react-bootstrap';

export default function FileTableRow({
  fileName,
  fileType,
  permissions,
  updatedAt,
  clickDirectory,
}) {
  const click = () => {
    if (fileType == 'directory') {
      clickDirectory(fileName);
    } else {
      // TODO: popup the text file
    }
  };

  return (
    <tr>
      <td>
        <a
          onClick={click}
          style={
            fileName != '.'
              ? {
                  color: '#646cff',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }
              : {}
          }
        >
          {fileName}
        </a>
      </td>
      <td>{fileType}</td>
      <td>
        {(permissions.read ? 'R' : '') +
          (permissions.write ? 'W' : '') +
          (permissions.execute ? 'X' : '')}
      </td>
      <td>{new Date(updatedAt).toLocaleString()}</td>
      <td>
        <div>
          <Button variant="dark" className="mx-3">
            Delete
          </Button>
          <Button variant="dark">Rename</Button>
        </div>
      </td>
    </tr>
  );
}
