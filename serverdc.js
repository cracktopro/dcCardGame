const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const debug = require('debug')('dc:server');


// Configurar el middleware para servir archivos estáticos
app.use(express.static('dc')); // 'dc' es la carpeta donde se encuentran tus archivos estáticos

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/tablerov2.html'); // Ruta al archivo HTML principal
});

app.get('/resources/style.css', (req, res) => {
  res.sendFile(__dirname + '/resources/style.css');
});

io.on('connection', (socket) => {
  console.log('Usuario conectado');

    //----------------COMUNICACIÓN CON CLIENTES---------------//

	 //EVENTO ACTUALIZAR SCORE HEROES
   
	  socket.on('actualizarScoreHeroe', (scoreHeroe) => {
		// Transmitir el nuevo texto a todos los clientes conectados, incluido el remitente
		io.emit('actualizarScoreHeroe', scoreHeroe);
		console.log('El servidor reenvia el valor: '+scoreHeroe);
	  });

    //EVENTO ACTUALIZAR SCORE VILLANOS

	  socket.on('actualizarScoreVillano', (scoreVillano) => {
      // Transmitir el nuevo texto a todos los clientes conectados, incluido el remitente
      io.emit('actualizarScoreVillano', scoreVillano);
      console.log('El servidor reenvia el valor: '+scoreVillano);
    });

    //------------CARGAR TOKENS------------------//

    socket.on('cargarToken', (imageUrl) => {
        // Emitir un evento a todos los clientes para que actualicen la acción
        io.emit('recargarToken', imageUrl);
        console.log('Server: Token recibido y envíado a clientes.');
    });

    //------------CARTAS HEROE-------------//
    //-------------------------------------//
    socket.on('cargarHero', (imageUrl) => {
      io.emit('cargarHero', imageUrl); // Esto debería ser modificado para emitir al cliente específico
      console.log('Server: Mazo Heroe recibido y envíado a clientes.');
    });
    socket.on('sacarHero', (randomNum) => {
      io.emit('sacarHero', randomNum); // Esto debería ser modificado para emitir al cliente específico
      console.log('Server: Carta %s de Heroe recibida y envíada a clientes.',randomNum);
    });
    //----------CARTAS VILLANO-----------//
    //-----------------------------------//
    socket.on('cargarVillano', (imageUrl) => {
      io.emit('cargarVillano', imageUrl); // Esto debería ser modificado para emitir al cliente específico
      console.log('Server: Mazo Villano recibido y envíado a clientes.');
    });
    socket.on('sacarVillano', (randomNum) => {
      io.emit('sacarVillano', randomNum); // Esto debería ser modificado para emitir al cliente específico
      console.log('Server: Carta de Villano recibida y envíada a clientes.');
    });
    //----------CARTAS MEJORA-----------//
    //-----------------------------------//
    socket.on('cargarMejora', (imageUrl) => {
      io.emit('cargarMejora', imageUrl); // Esto debería ser modificado para emitir al cliente específico
      console.log('Server: Mazo Mejora recibido y envíado a clientes.');
    });
    socket.on('sacarMejora', (randomNum) => {
      io.emit('sacarMejora', randomNum); // Esto debería ser modificado para emitir al cliente específico
      console.log('Server: Carta de Mejora recibida y envíada a clientes.');
    });
    //-----------LANZAR DADOS------------//
    //-----------------------------------//
    socket.on('lanzarDados', (resultados) => {
      io.emit('lanzarDados', resultados); // Esto debería ser modificado para emitir al cliente específico
      console.log('Server: Cliente realiza tirada de dados.');
    });

    //-----------TOP CARD------------//
    //-----------------------------------//
    let lastClickedCard = { cardId: '', zIndex: 0 };
    socket.on('topCard', (data) => {
        // Actualiza la información de la última carta clicada
        lastClickedCard = { cardId: data.cardId, zIndex: lastClickedCard.zIndex + 1 };
        // Envía la información actualizada a todos los clientes
        io.emit('topCard', lastClickedCard);
    });

    //-----------------------------------//
    //------------MOVER CARTAS-----------//
    //-----------------------------------//
    socket.on('startDrag', (dragInfo) => {
      // Emitir un evento a todos los clientes para informar sobre el inicio del arrastre
        io.emit('updateDrag', dragInfo);
    });

    // Evento cuando el cliente está arrastrando un elemento
    socket.on('dragging', (dragInfo) => {
        // Emitir un evento a todos los clientes para informar sobre la posición actualizada durante el arrastre
        io.emit('updateDrag', dragInfo);
    });

    // Evento cuando el cliente suelta un elemento
    socket.on('endDrag', (dragInfo) => {
        // Emitir un evento a todos los clientes para informar sobre el final del arrastre
        io.emit('updateDrag', dragInfo);
    });

    //-------------------------------------------------------//

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(80, 'localhost', () => {
  console.log('Servidor en ejecución en http://localhost:80');
});
