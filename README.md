# bl-auth
Authenticate legitimate users on Blockland.

## Usage

### `authenticate([string:username], [string:ip], [array:server (optional)])`

#### `[string:username]`

Required: Name of the Blockland user.

Example: `Blockhead100000`

#### `[string:ip]`

Required: Expected IP of the Blockland user.

Example: `123.123.123.123`

#### `[array:server]`

Optional: Use an alternative Blockland authentication server.
If this argument is not specified, the official Blockland authentication server will be used.

Example:

```javascript
{
  address: 'example.org',
  port: 80,
  path: '/authQuery.php',
  userAgent: 'Blockland-r2001'
}
```

All keys are optional.
If a key is skipped, the default value will be used.

## Examples

Check if the name **Blockhead100000** was last used by **123.123.123.123** on the official authentication server:

```javascript
const blauth = require('bl-auth');

blauth.authenticate('Blockhead100000', '123.123.123.123').then((resolve) => {
  if (resolve.success) {
    console.log('Authentication success, BL_ID is: ' + resolve.blid);
  } else {
    console.log('Authentication failed.');
  }
});
```

Check if the name **Blockhead100000** was last used by **123.123.123.123** on an alternative authentication server:

```javascript
const blauth = require('bl-auth');

const server = {
  address: 'example.org',
  port: 80,
  path: '/authQuery.php'
};

blauth.authenticate('Blockhead100000', '123.123.123.123', server).then((resolve) => {
  if (resolve.success) {
    console.log('Authentication success, BL_ID is: ' + resolve.blid);
  } else {
    console.log('Authentication failed.');
  }
});
```
