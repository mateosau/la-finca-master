<?php
require_once 'modelos.php'; // requerimos el archivo de clases modelo.php
$mensaje = '';

if (isset($_GET['tabla'])) { // si esta seteado el atributo tabla
    $t = $_GET['tabla'];
    $tabla = new ModeloABM($t);// creamos el objeto $tabla

    if(isset($_GET['id'])){  // si esta seteado el atributo id
        $tabla->set_criterio("id=".$_GET['id']);  // establecemis el criterio
    }

    if (isset($_GET['accion'])) { // Si esta seteado el atributo accion
        if($_GET['accion'] == 'insertar' || $_GET['accion'] == 'actualizar') {
            $valores = $_POST;
        }

        // Subida de imagens
        if(                                                                    //si
            isset($_FILES) &&                                                  // Esta seteado $_FILES y
            isset($_FILES['imagen']) &&                                        // esta seteado $_FILES ['imagen'] y
            !empty($_FILES['imagen']['name'] &&                               // no esta vacio el nombre de la imagen y
            !empty($_FILES['imagen']['tmp_name']))                              // no esta vacio el nombre temporal
        ){
            if(is_uploaded_file($_FILES['imagen']['tmp_name'])){
                $tmp_nombre = $_FILES['imagen']['tmp_name'];
                $nombre = $_FILES['imagen']['name'];
                $destino = '../imagenes/productos/' . $nombre;

                if(move_uploaded_file($tmp_nombre, $destino)){  // si podemos mover el archivo temporalmente
                    $mensaje .= 'archivo subido correctamente a ' . $destino;
                    $valores['imagen'] = $nombre;
                } else {
                    $mensaje .= 'no se ha podido subir el archivo';
                    unlink(ini_get('upload_tmp_dir').$_FILES['imagen']['tmp_name']);
                }
            } else {
                $mensaje .= 'Error : el archivo no fue procesado correctamente';
            }
        }
        
        
        
        
        switch ($_GET['accion']) {                           //segun la accion
            case 'seleccionar':                                // en caso q sea 'seleccionar'
                $datos = $tabla->seleccionar();                // Ejecutamos el metodo seleccionar()
                echo $datos;                                   // Devolvemps los datos
                break;

            case 'insertar':                                   // En caso q sea 'insetar'
                $tabla->insertar($valores);                    // Ejecutamos el metodo insertar()   
                $mensaje .= 'Datos guardados';                 // creamos el mensaje
                echo json_encode($mensaje);                    // mostramos el mensaje
                break;

            case 'actualizar':                             // en casp q sea 'actualizar'
                $tabla->actualizar($valores);              // ejecutamos el metodo actualizar()
                $mensaje .= 'Datos actualizar';             // creamos un mensaje
                echo json_encode($mensaje);                // mostramos el mensaje
                break;

            case 'eliminar':                            // EN caso q sea 'eliminar'
                $tabla->eliminar();                     // ejecutamos el metodo eliminar
                $mensaje .= 'Registro eliminado';        // creamos un mensaje
                echo json_encode($mensaje);             // mostramos el mensaje
                break;

        }
    }
}
