export async function login(userParam, passParam) {
  try {
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: userParam,
        password: passParam
      })
    });

    if (!response.ok) {
      console.error('Error al auth');
      return false;
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}