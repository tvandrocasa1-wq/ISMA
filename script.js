// JavaScript: lee JSON, dimensiona la cinta y dibuja en Canvas.

// Datos por defecto (permite abrir el HTML con doble clic directamente sin necesidad de servidor web).
// Es una copia exacta de datos.json.
const DATOS_POR_DEFECTO = {"g":9.81,"materiales":[{"id":"granito","nombre":"Granito fino (indicaciones)","densidad":1500,"sobrecarga":15,"categoria":"C","tamano":10,"granulometria":"uniforme"},{"id":"caliza","nombre":"Roca caliza (indicaciones)","densidad":1400,"sobrecarga":15,"categoria":"B","tamano":250,"granulometria":"mixto"},{"id":"arena_seca","nombre":"Arena seca (orientativo)","densidad":1600,"sobrecarga":20,"categoria":"C","tamano":5,"granulometria":"uniforme"},{"id":"arena_humeda","nombre":"Arena húmeda (orientativo)","densidad":1900,"sobrecarga":25,"categoria":"C","tamano":5,"granulometria":"uniforme"},{"id":"antracita","nombre":"Carbón, antracita (orientativo)","densidad":960,"sobrecarga":15,"categoria":"B","tamano":50,"granulometria":"mixto"},{"id":"cemento","nombre":"Cemento en polvo (orientativo)","densidad":1200,"sobrecarga":10,"categoria":"B","tamano":1,"granulometria":"uniforme"},{"id":"clinker","nombre":"Clínker de cemento (orientativo)","densidad":1500,"sobrecarga":20,"categoria":"C","tamano":60,"granulometria":"mixto"},{"id":"mineral_hierro","nombre":"Mineral de hierro, pirita (orientativo)","densidad":2200,"sobrecarga":20,"categoria":"D","tamano":80,"granulometria":"mixto"},{"id":"cereal","nombre":"Cereal, trigo (orientativo)","densidad":750,"sobrecarga":10,"categoria":"A","tamano":8,"granulometria":"uniforme"},{"id":"otro","nombre":"Otro material (escribe sus datos)","densidad":1000,"sobrecarga":20,"categoria":"B","tamano":50,"granulometria":"mixto"}],"velocidades":[0.66,0.84,1.05,1.31,1.68,2.09,2.62,3.35,4.19,5.24],"bandas":[{"B":400,"uniforme":50,"mixto":100,"vmax":{"A":2.62,"B":2.09,"C":2.09,"D":1.31}},{"B":500,"uniforme":75,"mixto":150,"vmax":{"A":2.62,"B":2.62,"C":2.09,"D":1.68}},{"B":650,"uniforme":125,"mixto":200,"vmax":{"A":3.35,"B":2.62,"C":2.62,"D":1.68}},{"B":800,"uniforme":170,"mixto":300,"vmax":{"A":3.35,"B":3.35,"C":2.62,"D":2.09}},{"B":1000,"uniforme":250,"mixto":400,"vmax":{"A":4.19,"B":3.35,"C":3.35,"D":2.09}},{"B":1200,"uniforme":350,"mixto":500,"vmax":{"A":4.19,"B":3.35,"C":3.35,"D":2.62}},{"B":1400,"uniforme":400,"mixto":600,"vmax":{"A":4.19,"B":3.35,"C":3.35,"D":3.35}},{"B":1600,"uniforme":450,"mixto":650,"vmax":{"A":4.19,"B":4.19,"C":3.35,"D":3.35}},{"B":1800,"uniforme":500,"mixto":700,"vmax":{"A":4.19,"B":4.19,"C":3.35,"D":3.35}},{"B":2000,"uniforme":550,"mixto":750,"vmax":{"A":5.24,"B":4.19,"C":3.35,"D":3.35}},{"B":2200,"uniforme":600,"mixto":800,"vmax":{"A":5.24,"B":5.24,"C":4.19,"D":4.19}}],"rodillos":[{"B":300,"plana":380,"dos":200,"tres":null},{"B":400,"plana":500,"dos":250,"tres":160},{"B":500,"plana":600,"dos":315,"tres":200},{"B":600,"plana":700,"dos":340,"tres":250},{"B":650,"plana":750,"dos":380,"tres":250},{"B":800,"plana":950,"dos":465,"tres":315},{"B":1000,"plana":1150,"dos":600,"tres":380},{"B":1200,"plana":1400,"dos":700,"tres":465},{"B":1400,"plana":1600,"dos":800,"tres":530},{"B":1600,"plana":1800,"dos":900,"tres":600},{"B":1800,"plana":2000,"dos":1000,"tres":670},{"B":2000,"plana":2200,"dos":1100,"tres":750},{"B":2200,"plana":2500,"dos":1250,"tres":800}],"factorK":[[0,1],[2,1],[4,0.99],[6,0.98],[8,0.97],[10,0.95],[12,0.93],[14,0.91],[16,0.89],[18,0.85],[20,0.81],[21,0.78],[22,0.76],[23,0.73],[24,0.71],[25,0.68],[26,0.66],[27,0.64],[28,0.61],[29,0.59],[30,0.56]],"factorGranulometria":{"hasta20":{"mixto":3,"uniforme":5},"hasta30":{"mixto":6,"uniforme":10}},"coeficienteC":[[80,1.8],[100,1.7],[125,1.6],[160,1.5],[200,1.4],[250,1.3],[320,1.2],[400,1.1],[500,1.05]],"seguridad":[{"desde":0,"S":11},{"desde":6,"S":12},{"desde":10,"S":13}],"capacidadRulmeca":{"sobrecarga":[5,10,20,25,30],"plana":{"300":[3.6,7.5,15.4,20.1,25.2],"400":[7.5,15.1,31.3,39.9,50.0],"500":[12.6,25.2,52.2,66.6,83.5],"650":[22.3,45.0,93.2,119.5,149.4],"800":[35.2,70.9,146.5,187.5,198.3],"1000":[56.8,114.4,235.8,301.6,377.2],"1200":[83.8,167.7,346.3,436.6,554.0],"1400":[115.5,231.4,478.0,611.6,763.2],"1600":[152.6,305.6,630.7,807.1,1008.7],"1800":[194.7,389.8,804.9,1029.9,1287.0],"2000":[241.9,484.2,1000.0,1279.4,1599.1],"2200":[295.5,591.1,1220.4,1560.8,1949.4],"2400":[353.1,706.3,1458.3,1865.1,2329.5],"2600":[415.9,831.9,1717.9,2197.1,2744.1],"2800":[484.0,968.0,1998.7,2556.3,3192.8],"3000":[557.1,1114.2,2300.4,2942.2,3674.8]},"dosRodillosLambda20":{"300":[17.6,20.5,28.8,32.0,36.3],"400":[34.5,41.4,55.8,63.7,72.0],"500":[57.6,68.7,92.8,105.8,119.8],"650":[102.9,123.1,165.9,189.3,214.5],"800":[175.6,192.9,260.2,296.6,336.2],"1000":[317.1,310.6,418.6,477.3,541.0]},"tresRodillos":{"45":{"300":[21.6,24.4,30.6,33.8,37.8],"400":[45.7,51.4,66.3,69.8,77.0],"500":[78.4,87.4,106.9,117.7,129.6],"650":[143.2,159.1,193.6,212.4,233.6],"800":[227.1,252.0,306.0,334.8,367.9],"1000":[368.6,408.6,494.6,541.0,594.0],"1200":[545.0,602.6,728.2,795.9,873.3],"1400":[753.8,834.1,1006.9,1100.1,1206.3],"1600":[997.5,1102.6,1330.2,1452.9,1593.0],"1800":[1274.7,1409.0,1698.8,1854.7,2032.9],"2000":[1586.5,1752.8,2112.1,2305.8,2526.8],"2200":[1908.1,2109.2,2546.2,2777.9,3045.5],"2400":[2275.5,2514.2,3041.2,3317.9,3636.4],"2600":[2697.3,2981.5,3592.0,3918.8,4295.0],"2800":[3119.7,3448.4,4168.4,4547.7,4984.2],"3000":[3597.8,3976.9,4800.2,5237.0,5739.7]},"35":{"300":[18.7,21.6,28.8,32.4,36.3],"400":[39.6,45.3,59.4,66.6,74.5],"500":[68.0,78.4,101.1,112.6,126.0],"650":[124.9,142.9,183.6,204.4,227.8],"800":[198.3,226.8,290.1,322.9,359.2],"1000":[322.9,368.6,469.8,522.0,580.6],"1200":[477.0,543.9,692.6,768.9,855.0],"1400":[661.3,753.4,957.9,1063.4,1181.8],"1600":[875.5,997.2,1266.4,1405.4,1561.3],"1800":[1119.6,1274.4,1617.8,1794.9,1993.6],"2000":[1393.9,1586.1,2012.0,2231.6,2478.6],"2200":[1691.3,1925.2,2433.2,2698.4,2995.2],"2400":[2010.7,2288.8,2896.2,3211.8,3565.0],"2600":[2382.4,2711.8,3425.0,3798.3,4216.1],"2800":[2759.4,3141.0,3971.5,4404.3,4888.7],"3000":[3184.8,3625.2,4579.5,5078.6,5637.2]},"30":{"300":[17.2,20.5,27.7,31.6,36.0],"400":[36.6,43.2,57.2,65.1,73.4],"500":[62.6,73.4,97.2,109.8,123.8],"650":[114.4,134.2,176.4,198.7,223.5],"800":[182.1,212.7,278.2,313.2,352.4],"1000":[296.2,345.6,450.7,506.5,569.1],"1200":[438.1,510.1,664.2,745.9,837.7],"1400":[606.9,706.3,918.7,1031.4,1157.7],"1600":[803.8,934.5,1214.2,1363.3,1529.6],"1800":[1027.8,1194.4,1551.2,1740.0,1953.0],"2000":[1279.8,1486.4,1929.2,2164.6,2427.8],"2200":[1545.4,1796.0,2331.7,2613.6,2930.0],"2400":[1832.9,2130.1,2776.3,3112.2,3488.7],"2600":[2175.9,2528.6,3281.7,3678.7,4123.8],"2800":[2517.8,2926.0,3805.5,4265.9,5185.6],"3000":[2905.6,3376.8,4390.9,4922.1,5517.6]},"25":{"300":[15.1,18.7,26.2,30.2,34.9],"400":[32.4,29.2,54.3,62.2,70.9],"500":[55.8,67.3,91.8,104.7,119.1],"650":[101.8,122.4,166.3,189.7,215.2],"800":[162.0,194.4,262.8,299.1,339.4],"1000":[263.8,315.3,425.5,483.8,548.6],"1200":[389.8,465.4,627.1,712.8,807.4],"1400":[540.7,644.7,867.6,985.3,1116.3],"1600":[716.0,853.2,1146.9,1302.1,1474.9],"1800":[915.4,1090.8,1465.2,1663.2,1883.1],"2000":[1139.7,1357.2,1822.3,2068.2,2341.4],"2200":[1371.5,1634.4,2199.9,2496.8,2826.3],"2400":[1632.9,1945.8,2618.6,2972.1,3364.4],"2600":[1936.7,2307.9,3099.6,3518.0,3982.3],"2800":[2240.7,2670.1,3592.0,4076.9,4615.0],"3000":[2585.8,3079.0,4140.3,4699.2,5319.4]},"20":{"300":[13.3,16.9,24.4,27.7,33.4],"400":[28.0,35.2,50.4,56.8,67.7],"500":[47.8,60.1,85.3,96.1,114.1],"650":[87.8,109.4,154.4,174.2,205.5],"800":[139.6,173.6,244.0,275.0,324.0],"1000":[227.1,281.1,394.9,444.9,523.4],"1200":[335.8,415.0,581.7,655.2,770.4],"1400":[465.8,574.9,804.9,906.4,1064.8],"1600":[616.6,760.6,1063.8,1198.0,1432.8],"1800":[788.7,972.3,1353.2,1530.7,1796.4],"2000":[981.7,1209.9,1690.0,1903.6,2233.4],"2200":[1185.1,1461.1,2048.0,2316.2,2716.9],"2400":[1403.7,1730.5,2431.0,2749.4,3225.0],"2600":[1670.0,2058.8,2886.4,3264.5,3829.2],"2800":[1930.8,2380.3,3342.6,3780.0,4433.9],"3000":[2227.0,2745.7,3851.2,4355.7,5109.2]}}},"ejemplos":[{"id":"apuntes","nombre":"Apuntes, diseño preliminar (págs. 39-44)","nota":"Reproduce el ejemplo de los apuntes: L = 200 m, H = 10 m, T₂ = 4000 N y tensiones locales de 6000 y 4000 N. Los apuntes solo dan qR = 10 kg/m; el reparto 7 + 3 no afecta a estos resultados.","valores":{"modo":"comprobar","datoCarga":"qg","Q":180,"qgDato":25,"material":"otro","rho":1000,"talud":20,"categoria":"B","granulometria":"mixto","tamano":50,"L":200,"H":10,"estacion":"3","lambda":35,"metodoCap":"masico","B":800,"v":2,"qb":8,"qRO":7,"qRU":3,"lsup":1.2,"linf":2.4,"hmax":1,"f":0.02,"usoC":"manual","C":1.45,"vent":0,"FNtamb":20,"FS1":0,"FS2":40,"eta":0.9,"r":0.2,"mu":0.3,"thetaDeg":180,"modoT2":"manual","margen":15,"T2":4000,"modoLocal":"manual","Tsup":6000,"Tinf":4000,"R":160,"zmin":3},"casillas":["L","H","qgDato","B","v","qb","lsup","linf","hmax","f","C","FS1","FS2","eta","r","mu","thetaDeg","R"]},{"id":"granito","nombre":"Indicaciones, granito 100 t/h (ejemplo 3)","nota":"Comprueba la cinta del ejemplo 3 de las indicaciones con B = 400 mm y v = 1,52 m/s. El enunciado no da μ: aquí se toma 0,30.","valores":{"modo":"comprobar","datoCarga":"Q","Q":100,"qgDato":18.27,"material":"granito","rho":1500,"talud":15,"categoria":"C","granulometria":"uniforme","tamano":10,"L":100,"H":0,"estacion":"3","lambda":30,"metodoCap":"masico","B":400,"v":1.52,"qb":3.8,"qRO":4.5,"qRU":1.6667,"lsup":1.2,"linf":2.4,"hmax":1,"f":0.02,"usoC":"manual","C":1.7,"vent":0,"FNtamb":0,"FS1":0,"FS2":0,"eta":0.85,"r":0.2,"mu":0.3,"thetaDeg":210,"modoT2":"auto","margen":15,"T2":1500,"modoLocal":"recorrido","Tsup":3000,"Tinf":1500,"R":200,"zmin":3},"casillas":["material","rho","talud","categoria","tamano","granulometria","Q","L","H","estacion","lambda","eta","C","qb","qRO","qRU","lsup","linf","R","thetaDeg","f","B","v"]},{"id":"caliza","nombre":"Indicaciones, caliza 1500 t/h (ejemplo 1)","nota":"La app elige B = 1000 mm y v = 3,35 m/s, como las indicaciones. Ese ejemplo solo trata la capacidad: el resto de datos (bandas, rodillos, tambor) son valores de muestra.","valores":{"modo":"dimensionar","datoCarga":"Q","Q":1500,"qgDato":124,"material":"caliza","rho":1400,"talud":15,"categoria":"B","granulometria":"mixto","tamano":250,"L":805,"H":150,"estacion":"3","lambda":35,"metodoCap":"volumetrico","B":1000,"v":3.35,"qb":20,"qRO":18,"qRU":7,"lsup":1.2,"linf":2.4,"hmax":1,"f":0.02,"usoC":"auto","C":1.05,"vent":0,"FNtamb":0,"FS1":0,"FS2":100,"eta":0.9,"r":0.5,"mu":0.35,"thetaDeg":210,"modoT2":"auto","margen":15,"T2":150000,"modoLocal":"recorrido","Tsup":150000,"Tinf":100000,"R":400,"zmin":3},"casillas":["material","rho","talud","categoria","tamano","granulometria","Q","L","H","estacion","lambda"]},{"id":"inicio","nombre":"Dimensionar desde cero (granito, 100 t/h)","nota":"Elige el material, la capacidad, y si quieres fija B y v. El resto de ejemplos está en este desplegable y los 19 ejercicios, en la sección 4.","valores":{"modo":"dimensionar","datoCarga":"Q","Q":100,"qgDato":18.27,"material":"granito","rho":1500,"talud":15,"categoria":"C","granulometria":"uniforme","tamano":10,"L":100,"H":0,"estacion":"3","lambda":30,"metodoCap":"masico","B":400,"v":2.09,"qb":3.8,"qRO":4.5,"qRU":1.6667,"lsup":1.2,"linf":2.4,"hmax":1,"f":0.02,"usoC":"manual","C":1.7,"vent":0,"FNtamb":0,"FS1":0,"FS2":0,"eta":0.85,"r":0.2,"mu":0.3,"thetaDeg":210,"modoT2":"auto","margen":15,"T2":1500,"modoLocal":"recorrido","Tsup":3000,"Tinf":1500,"R":200,"zmin":3},"casillas":["material","rho","talud","categoria","tamano","granulometria","Q","L","H","estacion","lambda","eta","C","qb","qRO","qRU","lsup","linf","R","thetaDeg","f"]},{"id":"fallo_patina","nombre":"⚠ Caso que falla: la banda patina (T₂ = 1500 N)","nota":"Apuntes con T₂ = 1500 N. En 3D, pulsa «Tambor motriz»: el tambor se pone en rojo y gira en falso. Arréglalo con «Aplicar» en «Subir T₂»: T₂ = 4000 N.","valores":{"modo":"comprobar","datoCarga":"qg","Q":180,"qgDato":25,"material":"otro","rho":1000,"talud":20,"categoria":"B","granulometria":"mixto","tamano":50,"L":200,"H":10,"estacion":"3","lambda":35,"metodoCap":"masico","B":800,"v":2,"qb":8,"qRO":7,"qRU":3,"lsup":1.2,"linf":2.4,"hmax":1,"f":0.02,"usoC":"manual","C":1.45,"vent":0,"FNtamb":20,"FS1":0,"FS2":40,"eta":0.9,"r":0.2,"mu":0.3,"thetaDeg":180,"modoT2":"manual","margen":15,"T2":1500,"modoLocal":"manual","Tsup":6000,"Tinf":4000,"R":160,"zmin":3},"casillas":["L","H","qgDato","B","v","qb","lsup","linf","hmax","f","C","FS1","FS2","eta","r","mu","thetaDeg","R"]},{"id":"fallo_flecha","nombre":"⚠ Caso que falla: flecha excesiva (T = 3000 y 1500 N)","nota":"Apuntes con tensiones locales de 3000 y 1500 N. En 3D, pulsa «Flecha»: los ramales que fallan se ponen en rojo y se hunden, con el dibujo × 20. Arréglalo con «Aplicar»: T = 4900 y 2400 N.","valores":{"modo":"comprobar","datoCarga":"qg","Q":180,"qgDato":25,"material":"otro","rho":1000,"talud":20,"categoria":"B","granulometria":"mixto","tamano":50,"L":200,"H":10,"estacion":"3","lambda":35,"metodoCap":"masico","B":800,"v":2,"qb":8,"qRO":7,"qRU":3,"lsup":1.2,"linf":2.4,"hmax":1,"f":0.02,"usoC":"manual","C":1.45,"vent":0,"FNtamb":20,"FS1":0,"FS2":40,"eta":0.9,"r":0.2,"mu":0.3,"thetaDeg":180,"modoT2":"manual","margen":15,"T2":4000,"modoLocal":"manual","Tsup":3000,"Tinf":1500,"R":160,"zmin":3},"casillas":["L","H","qgDato","B","v","qb","lsup","linf","hmax","f","C","FS1","FS2","eta","r","mu","thetaDeg","R"]},{"id":"fallo_capacidad","nombre":"⚠ Caso que falla: falta capacidad (300 t/h en B = 400 mm)","nota":"Granito con Q = 300 t/h en una banda de 400 mm. En 3D, el material rebosa y cae por los lados. Arréglalo con «Aplicar» en «Cambiar la banda y la velocidad».","valores":{"modo":"comprobar","datoCarga":"Q","Q":300,"qgDato":18.27,"material":"granito","rho":1500,"talud":15,"categoria":"C","granulometria":"uniforme","tamano":10,"L":100,"H":0,"estacion":"3","lambda":30,"metodoCap":"masico","B":400,"v":1.68,"qb":3.8,"qRO":4.5,"qRU":1.6667,"lsup":1.2,"linf":2.4,"hmax":1,"f":0.02,"usoC":"manual","C":1.7,"vent":0,"FNtamb":0,"FS1":0,"FS2":0,"eta":0.85,"r":0.2,"mu":0.3,"thetaDeg":210,"modoT2":"auto","margen":15,"T2":1500,"modoLocal":"recorrido","Tsup":3000,"Tinf":1500,"R":200,"zmin":3},"casillas":["material","rho","talud","categoria","tamano","granulometria","Q","L","H","estacion","lambda","eta","C","qb","qRO","qRU","lsup","linf","R","thetaDeg","f","B","v"]},{"id":"fallo_velocidad","nombre":"⚠ Caso que falla: velocidad excesiva (v = 4,19 m/s)","nota":"Granito a 4,19 m/s en una banda de 400 mm, cuando la Tabla 1.3 admite 2,09 m/s. En 3D, el material se derrama. Arréglalo con «Aplicar» en «Cambiar la banda y la velocidad».","valores":{"modo":"comprobar","datoCarga":"Q","Q":100,"qgDato":18.27,"material":"granito","rho":1500,"talud":15,"categoria":"C","granulometria":"uniforme","tamano":10,"L":100,"H":0,"estacion":"3","lambda":30,"metodoCap":"masico","B":400,"v":4.19,"qb":3.8,"qRO":4.5,"qRU":1.6667,"lsup":1.2,"linf":2.4,"hmax":1,"f":0.02,"usoC":"manual","C":1.7,"vent":0,"FNtamb":0,"FS1":0,"FS2":0,"eta":0.85,"r":0.2,"mu":0.3,"thetaDeg":210,"modoT2":"auto","margen":15,"T2":1500,"modoLocal":"recorrido","Tsup":3000,"Tinf":1500,"R":200,"zmin":3},"casillas":["material","rho","talud","categoria","tamano","granulometria","Q","L","H","estacion","lambda","eta","C","qb","qRO","qRU","lsup","linf","R","thetaDeg","f","B","v"]}],"ejercicios":[{"id":"ej1","titulo":"Ejemplo 1. Resistencias de avance (L = 60 m)","fuente":"Apuntes, pág. 29","tipo":"cinta","enunciado":"Cinta horizontal de L = 60 m, v = 2 m/s, q<sub>b</sub> = 8, q<sub>g</sub> = 25, q<sub>R</sub> = 10 kg/m, f = 0,02, v<sub>ent</sub> = 0, F<sub>N,tamb</sub> = 20 N, F<sub>S2</sub> = 40 N. Calcular las resistencias y F<sub>u</sub>.","datos":{"base":"apuntes","L":60,"H":0,"T2":600,"Tsup":5000,"Tinf":2500},"publicado":[{"nombre":"F<sub>u</sub> (N)","clave":"Fu","valor":760.37,"tol":0.01}],"casillas":["L","H","v","qb","qgDato","f","vent","FNtamb","FS1","FS2"]},{"id":"ej2","titulo":"Ejemplo 2. Longitud corregida (L = 200 m)","fuente":"Apuntes, pág. 30","tipo":"cinta","enunciado":"Cinta horizontal de L = 200 m, v = 2 m/s, mismas masas, f = 0,02, C = 1,45 y F<sub>S2</sub> = 40 N. Calcular L<sub>C</sub>, F<sub>u</sub> y P<sub>u</sub>.","datos":{"base":"apuntes","L":200,"H":0},"publicado":[{"nombre":"F<sub>H</sub> + F<sub>N</sub> (N)","clave":"FHN","valor":2901.8,"tol":0.01},{"nombre":"F<sub>u</sub> (N)","clave":"Fu","valor":2941.8,"tol":0.01},{"nombre":"P<sub>u</sub> (kW)","clave":"Pu_kW","valor":5.88,"tol":0.005}],"casillas":["L","H","v","qb","qgDato","f","C","FS1","FS2"]},{"id":"ej3","titulo":"Ejemplo 3. Potencia, par y giro","fuente":"Apuntes, pág. 31","tipo":"cinta","enunciado":"Para la cinta del ejemplo 1, calcular P<sub>u</sub> y la potencia en el eje con η = 0,90 y r = 0,20 m.","datos":{"base":"apuntes","L":60,"H":0,"T2":600,"Tsup":5000,"Tinf":2500},"publicado":[{"nombre":"P<sub>u</sub> (kW)","clave":"Pu_kW","valor":1.52,"tol":0.005},{"nombre":"P<sub>eje</sub> (kW)","clave":"Peje_kW","valor":1.69,"tol":0.005},{"nombre":"M (N·m)","clave":"M","valor":152.07,"tol":0.01},{"nombre":"n (rpm)","clave":"n","valor":95.5,"tol":0.05,"dec":1}],"casillas":["L","H","v","qb","qgDato","f","vent","FNtamb","FS1","FS2","eta","r"]},{"id":"ej4","titulo":"Ejemplo 4. Tensiones límite y deslizamiento","fuente":"Apuntes, pág. 32","tipo":"adherencia","enunciado":"F<sub>u</sub> = 760,37 N, φ = 180°, μ = 0,30. Comprobar T₂ = 400 N (patina) y adoptar T₂ = 600 N.","datos":{"Fu":760.37,"mu":0.3,"casos":[{"phi":180,"T2":400},{"phi":180,"T2":600}]},"publicado":[{"nombre":"e<sup>μφ</sup>","clave":"k_1","valor":2.5663,"tol":0.0001,"dec":4},{"nombre":"F<sub>u,máx</sub> con 400 N (N)","clave":"FuMax_1","valor":626.53,"tol":0.02},{"nombre":"T₂,mín (N)","clave":"T2min_1","valor":485.45,"tol":0.02},{"nombre":"F<sub>u,máx</sub> con 600 N (N)","clave":"FuMax_2","valor":939.8,"tol":0.02},{"nombre":"Reserva con 600 N (%)","clave":"reserva_2","valor":23.6,"tol":0.05,"dec":1}],"carga":{"L":60,"H":0,"FuDato":760.37,"mu":0.3,"thetaDeg":180,"modoT2":"manual","T2":400},"notaCarga":"Se carga el primer caso, T₂ = 400 N. Para el segundo, escribe T₂ = 600 N.","casillas":["FuDato","mu","thetaDeg","T2"]},{"id":"ej5","titulo":"Ejemplo 5. Flecha entre rodillos","fuente":"Apuntes, pág. 33","tipo":"flecha","enunciado":"q<sub>b</sub> = 8, q<sub>g</sub> = 25 kg/m, l<sub>R</sub> = 1,20 y 2,40 m, T = 5000 y 2500 N, flecha máxima del 1 %.","datos":{"qb":8,"qg":25,"lsup":1.2,"linf":2.4,"Tsup":5000,"Tinf":2500},"publicado":[{"nombre":"h portante (mm)","clave":"hSup","valor":11.65,"tol":0.01},{"nombre":"Relativa portante (%)","clave":"relSup","valor":0.971,"tol":0.001,"dec":3},{"nombre":"h retorno (mm)","clave":"hInf","valor":22.6,"tol":0.01},{"nombre":"Relativa retorno (%)","clave":"relInf","valor":0.942,"tol":0.001,"dec":3},{"nombre":"T mín. portante (N)","clave":"TsupMin","valor":4855.95,"tol":0.01},{"nombre":"T mín. retorno (N)","clave":"TinfMin","valor":2354.4,"tol":0.01}],"carga":{"L":200,"H":0,"qb":8,"qgDato":25,"lsup":1.2,"linf":2.4,"hmax":1,"modoLocal":"manual","Tsup":5000,"Tinf":2500},"casillas":["qb","qgDato","lsup","linf","Tsup","Tinf","hmax"]},{"id":"ej6","titulo":"Ejemplo 6. Resistencia a la rotura","fuente":"Apuntes, pág. 34","tipo":"capas","enunciado":"T<sub>máx</sub> = 18 000 N, B = 800 mm, R = 160 N/mm. Calcular el número de capas.","nota":"Los apuntes escriben T<sub>adm</sub> = 256 000/11 = 32 000 N, pero 256 000/11 = 23 273 N. El resultado de 2 capas sigue siendo válido, con reserva 1,29 en lugar de 1,78.","datos":{"Tmax":18000,"B":800,"R":160,"zmin":1},"publicado":[{"nombre":"z teórico","clave":"zTeorico","valor":1.547,"tol":0.001,"dec":3},{"nombre":"z","clave":"z","valor":2,"tol":0,"dec":0},{"nombre":"T<sub>adm</sub> (N)","clave":"Tadm","valor":32000,"tol":1,"dec":0,"errata":true},{"nombre":"Reserva","clave":"reserva","valor":1.78,"tol":0.01,"errata":true}],"carga":{"TmaxDato":18000,"B":800,"R":160,"zmin":1},"casillas":["TmaxDato","B","R"]},{"id":"ej7","titulo":"Ejemplo 7. Resistencias con desnivel (L = 50 m)","fuente":"Apuntes, págs. 35-36","tipo":"cinta","enunciado":"L = 50 m, H = 4 m, v = 1,5 m/s, q<sub>b</sub> = 10, q<sub>g</sub> = 30, q<sub>R</sub> = 12 kg/m, f = 0,025, v<sub>ent</sub> = 0,5 m/s, F<sub>N,tamb</sub> = 25 N, F<sub>S2</sub> = 50 N.","datos":{"base":"apuntes","L":50,"H":4,"v":1.5,"qgDato":30,"qb":10,"qRO":8,"qRU":4,"f":0.025,"vent":0.5,"FNtamb":25,"FS2":50},"publicado":[{"nombre":"δ (°)","clave":"deltaDeg","valor":4.59,"tol":0.005},{"nombre":"F<sub>St</sub> (N)","clave":"FSt","valor":1177.2,"tol":0.01},{"nombre":"F<sub>u</sub> (N)","clave":"Fu","valor":2055.51,"tol":0.01}],"casillas":["L","H","v","qb","qgDato","f","vent","FNtamb","FS1","FS2"]},{"id":"ej8","titulo":"Ejemplo 8. Longitud corregida y desnivel (L = 250 m)","fuente":"Apuntes, págs. 37-38","tipo":"cinta","enunciado":"L = 250 m, H = 12 m, v = 2,5 m/s, q<sub>b</sub> = 9, q<sub>g</sub> = 30, q<sub>R</sub> = 12 kg/m, f = 0,025, C = 1,35, F<sub>S2</sub> = 60 N.","datos":{"base":"apuntes","L":250,"H":12,"v":2.5,"qgDato":30,"qb":9,"qRO":8,"qRU":4,"f":0.025,"C":1.35,"FS2":60,"modoT2":"auto","modoLocal":"recorrido"},"publicado":[{"nombre":"δ (°)","clave":"deltaDeg","valor":2.75,"tol":0.005},{"nombre":"F<sub>H</sub> + F<sub>N</sub> (N)","clave":"FHN","valor":4961.73,"tol":0.01},{"nombre":"F<sub>u</sub> (N)","clave":"Fu","valor":8553.33,"tol":0.01},{"nombre":"P<sub>u</sub> (kW)","clave":"Pu_kW","valor":21.38,"tol":0.005}],"casillas":["L","H","v","qb","qgDato","f","C","FS1","FS2"]},{"id":"dp","titulo":"Diseño preliminar completo (L = 200 m, H = 10 m)","fuente":"Apuntes, págs. 39-44","tipo":"cinta","enunciado":"Es el ejercicio de la cinta completa: resistencias, potencia, adherencia con T₂ = 4000 N, flecha con tensiones locales de 6000 y 4000 N y selección de la banda.","datos":{"base":"apuntes"},"publicado":[{"nombre":"F<sub>u</sub> (N)","clave":"Fu","valor":5391.38,"tol":0.01},{"nombre":"P<sub>u</sub> (kW)","clave":"Pu_kW","valor":10.78,"tol":0.005},{"nombre":"P<sub>eje</sub> (kW)","clave":"Peje_kW","valor":11.98,"tol":0.005},{"nombre":"M (N·m)","clave":"M","valor":1078.28,"tol":0.01},{"nombre":"T₁ (N)","clave":"T1","valor":9391.38,"tol":0.01},{"nombre":"Reserva (%)","clave":"reservaPct","valor":16.2,"tol":0.05,"dec":1},{"nombre":"Flecha portante (%)","clave":"relSupPct","valor":0.81,"tol":0.005},{"nombre":"Flecha retorno (%)","clave":"relInfPct","valor":0.59,"tol":0.005},{"nombre":"z","clave":"z","valor":3,"tol":0,"dec":0},{"nombre":"T<sub>adm</sub> (N)","clave":"Tadm","valor":34909,"tol":1,"dec":0}],"casillas":["L","H","qgDato","B","v","qb","lsup","linf","hmax","f","C","FS1","FS2","eta","r","mu","thetaDeg","R"]},{"id":"ej9","titulo":"Ejemplo 9. Adherencia y ángulo de abrazamiento","fuente":"Apuntes, págs. 45-47","tipo":"adherencia","enunciado":"F<sub>u</sub> = 8000 N, T₂ = 3000 N, μ = 0,30. Comprobar con φ = 180°, hallar el ángulo mínimo y verificar con φ = 270°.","nota":"Los apuntes redondean e<sup>μφ</sup> a tres decimales antes de multiplicar; de ahí las diferencias de 1 o 2 N.","datos":{"Fu":8000,"mu":0.3,"casos":[{"phi":180,"T2":3000},{"phi":270,"T2":3000}]},"publicado":[{"nombre":"F<sub>u,máx</sub> a 180° (N)","clave":"FuMax_1","valor":4698,"tol":2,"dec":0},{"nombre":"Ángulo mínimo (°)","clave":"phiMin_1","valor":248.1,"tol":0.05,"dec":1},{"nombre":"e<sup>μφ</sup> a 270°","clave":"k_2","valor":4.112,"tol":0.001,"dec":3},{"nombre":"F<sub>u,máx</sub> a 270° (N)","clave":"FuMax_2","valor":9336,"tol":3,"dec":0},{"nombre":"Reserva a 270° (%)","clave":"reserva_2","valor":16.7,"tol":0.05,"dec":1}],"carga":{"H":0,"FuDato":8000,"T2":3000,"mu":0.3,"thetaDeg":180,"modoT2":"manual"},"notaCarga":"Se carga φ = 180°. Para verificar la solución, escribe φ = 270°.","casillas":["FuDato","T2","mu","thetaDeg"]},{"id":"ej10","titulo":"Ejemplo 10. Aumentar T₂ o aumentar el ángulo","fuente":"Apuntes, págs. 48-51","tipo":"adherencia","enunciado":"F<sub>u</sub> = 12 000 N, T₂ = 3500 N, μ = 0,28, φ = 180°. Hallar la T₂ necesaria, el ángulo mínimo y verificar con φ = 315°.","nota":"Los apuntes redondean e<sup>μφ</sup> antes de multiplicar; de ahí las diferencias pequeñas.","datos":{"Fu":12000,"mu":0.28,"casos":[{"phi":180,"T2":3500},{"phi":315,"T2":3500}]},"publicado":[{"nombre":"e<sup>μφ</sup> a 180°","clave":"k_1","valor":2.41,"tol":0.001,"dec":3},{"nombre":"F<sub>u,máx</sub> a 180° (N)","clave":"FuMax_1","valor":4935,"tol":2,"dec":0},{"nombre":"T₂ necesaria (N)","clave":"T2min_1","valor":8511,"tol":2,"dec":0},{"nombre":"Ángulo mínimo (°)","clave":"phiMin_1","valor":304.5,"tol":0.05,"dec":1},{"nombre":"F<sub>u,máx</sub> a 315° (N)","clave":"FuMax_2","valor":12817,"tol":5,"dec":0},{"nombre":"Reserva a 315° (%)","clave":"reserva_2","valor":6.8,"tol":0.05,"dec":1}],"carga":{"H":0,"FuDato":12000,"T2":3500,"mu":0.28,"thetaDeg":180,"modoT2":"manual","B":800,"R":160,"zmin":3},"notaCarga":"Se carga φ = 180°. Para verificar la solución, escribe φ = 315°.","casillas":["FuDato","T2","mu","thetaDeg","B","R"]},{"id":"ej11","titulo":"Ejercicio 11. Potencia y velocidad de giro","fuente":"Apuntes, pág. 52","tipo":"potencia","enunciado":"v = 2 m/s, F<sub>t</sub> = 1000 N, η = 90 %, tambor de 200 mm de diámetro.","datos":{"Ft":1000,"v":2,"eta":0.9,"r":0.1},"publicado":[{"nombre":"P motor (W)","clave":"Pm","valor":2222.2,"tol":0.05,"dec":1},{"nombre":"ω (rad/s)","clave":"omega","valor":20,"tol":0},{"nombre":"n (rpm)","clave":"n","valor":191,"tol":0.5,"dec":0}],"carga":{"H":0,"FuDato":1000,"v":2,"eta":0.9,"r":0.1},"casillas":["FuDato","v","eta","r"]},{"id":"ej12","titulo":"Ejercicio 12. Número de capas con S variable","fuente":"Apuntes, pág. 53","tipo":"capas","enunciado":"B = 800 mm, R = 180 N/mm, T<sub>máx</sub> = 125 000 N, con S = 11, 12 o 13 según el número de capas.","datos":{"Tmax":125000,"B":800,"R":180,"zmin":1},"publicado":[{"nombre":"z teórico","clave":"zTeorico","valor":11.28,"tol":0.005},{"nombre":"z","clave":"z","valor":12,"tol":0,"dec":0}],"carga":{"TmaxDato":125000,"B":800,"R":180,"zmin":1},"casillas":["TmaxDato","B","R"]},{"id":"ej13","titulo":"Ejercicio 13. Capacidad de transporte","fuente":"Apuntes, pág. 54","tipo":"capacidad","enunciado":"Cinta inclinada 20° (k = 0,81), ρ = 1500 kg/m³, S = 0,014 m², v = 1,68 m/s.","nota":"Los apuntes dan 103,1 t/h, pero 3,6 · 1,68 · 0,014 · 1500 · 0,81 = 102,88 t/h.","datos":{"v":1.68,"S":0.014,"rho":1500,"k":0.81},"publicado":[{"nombre":"Q (t/h)","clave":"Q","valor":103.1,"tol":0.05,"dec":2,"errata":true}],"carga":{"modo":"comprobar","datoCarga":"Q","Q":100,"material":"granito","rho":1500,"talud":15,"categoria":"C","granulometria":"uniforme","tamano":10,"estacion":"3","lambda":30,"L":100,"H":34.202,"B":400,"v":1.68,"modoT2":"auto","margen":15},"notaCarga":"Se cargan v, ρ y la inclinación de 20°. La S = 0,014 m² del enunciado no se puede escribir en la calculadora, que obtiene S de B y los rodillos, y Q no es dato; el resultado de este ejercicio es el de la tabla de abajo. Por eso la comprobación de capacidad de la calculadora no corresponde a este ejercicio.","casillas":["v","rho"]},{"id":"ej14","titulo":"Ejercicio 14. Tensión mínima del tensor","fuente":"Apuntes, págs. 55-56","tipo":"tension","enunciado":"P = 100 kW, v = 2 m/s, μ = 0,2, φ = 160°. Calcular la tensión mínima en el ramal flojo.","datos":{"P":100000,"v":2,"mu":0.2,"phi":160},"publicado":[{"nombre":"F<sub>t</sub> (N)","clave":"Ft","valor":50000,"tol":0,"dec":0},{"nombre":"e<sup>μφ</sup>","clave":"k","valor":1.748,"tol":0.001,"dec":3},{"nombre":"T₂ (kN)","clave":"T2","valor":66.85,"tol":0.02}],"carga":{"H":0,"FuDato":50000,"v":2,"mu":0.2,"thetaDeg":160,"r":0.2,"modoT2":"auto","margen":0},"notaCarga":"F<sub>u</sub> = P/v = 100 000 / 2 = 50 000 N. La T₂ automática se redondea a la centena superior.","casillas":["v","mu","thetaDeg","r"]},{"id":"ej15","titulo":"Ejercicio 15. Separación máxima entre rodillos","fuente":"Apuntes, págs. 57-58","tipo":"vano","enunciado":"T = 20 kN, flecha admisible del 1 %, masa lineal de 150 kg/m.","datos":{"T":20000,"m":150},"publicado":[{"nombre":"q (N/m)","clave":"q","valor":1471.5,"tol":0.01,"dec":1},{"nombre":"l₀ (m)","clave":"l0","valor":1.087,"tol":0.001,"dec":3}],"carga":{"H":0,"modoLocal":"manual","Tsup":20000,"qb":8,"qgDato":142,"lsup":1.087,"hmax":1,"modoT2":"auto","margen":15},"notaCarga":"150 kg/m se reparte como q<sub>b</sub> + q<sub>g</sub> = 8 + 142. La separación de 1,087 m es el resultado: al cargarla, la flecha del portante sale justo 1 %. Las demás comprobaciones usan valores de muestra.","casillas":["Tsup","hmax"]},{"id":"in1","titulo":"Indicaciones, ejemplo 1. Caliza a 1500 t/h","fuente":"Indicaciones, método volumétrico","tipo":"cinta","enunciado":"Roca caliza, ρ = 1400 kg/m³, 10 % de gruesos, tamaño máximo 250 mm, θ = 15°, L = 805 m, H = 150 m, λ = 35°. Calcular la anchura y la velocidad.","nota":"Solo coinciden B y v exactamente. Las indicaciones toman Q<sub>v</sub> = 415 m³/h y K = 0,95 sin interpolar, y obtienen 1849 t/h; aquí se interpola en la tabla (419,2 m³/h, K = 0,943) y resulta 1853 t/h. El resto de datos de este caso son de muestra.","datos":{"base":"caliza"},"publicado":[{"nombre":"B (mm)","clave":"B","valor":1000,"tol":0,"dec":0},{"nombre":"v (m/s)","clave":"v","valor":3.35,"tol":0},{"nombre":"Capacidad (t/h)","clave":"Qcap","valor":1849,"tol":5,"dec":0}],"casillas":["material","rho","talud","categoria","tamano","granulometria","Q","L","H","estacion","lambda"]},{"id":"in2","titulo":"Indicaciones, ejemplo 2. Sección con 1, 2 y 3 rodillos","fuente":"Indicaciones, UNED","tipo":"seccion","enunciado":"B = 650 mm, θ = 15°. Determinar la sección con 1 rodillo, con 2 rodillos a 30° y con 3 rodillos a 45° (l₃ = 0,25 m).","datos":{"casos":[{"B":650,"estacion":1,"lambda":0,"talud":15},{"B":650,"estacion":2,"lambda":30,"talud":15},{"B":650,"estacion":3,"lambda":45,"talud":15}]},"publicado":[{"nombre":"S con 1 rodillo (m²)","clave":"S_1","valor":0.01278,"tol":1e-05,"dec":5},{"nombre":"S₁ con 2 rodillos (m²)","clave":"S1_2","valor":0.00959,"tol":1e-05,"dec":5},{"nombre":"S₂ con 2 rodillos (m²)","clave":"S2_2","valor":0.03098,"tol":1e-05,"dec":5},{"nombre":"S con 2 rodillos (m²)","clave":"S_2","valor":0.04057,"tol":1e-05,"dec":5},{"nombre":"S₁ con 3 rodillos (m²)","clave":"S1_3","valor":0.0091,"tol":1e-05,"dec":5},{"nombre":"S₂ con 3 rodillos (m²)","clave":"S2_3","valor":0.03534,"tol":1e-05,"dec":5},{"nombre":"S con 3 rodillos (m²)","clave":"S_3","valor":0.04444,"tol":1e-05,"dec":5}],"carga":{"talud":15,"estacion":"3","lambda":45,"B":650},"notaCarga":"Se carga el caso de 3 rodillos a 45°. Para los otros, cambia la estación y λ.","casillas":["B","talud","estacion","lambda"]},{"id":"in3","titulo":"Indicaciones, ejemplo 3. Granito a 100 t/h","fuente":"Indicaciones, ejemplo del libro","tipo":"cinta","enunciado":"Granito fino, 10 mm, ρ = 1500 kg/m³, θ = 15°, Q = 100 t/h, L = 100 m horizontal, 3 rodillos a 30°, η = 85 %, C = 1,7, q<sub>b</sub> = 3,8 kg/m.","nota":"F<sub>u</sub> difiere 0,15 N porque las indicaciones redondean q<sub>g</sub> a 18,27 kg/m. El enunciado no da μ: se toma 0,30.","datos":{"base":"granito"},"publicado":[{"nombre":"S (m²)","clave":"seccionS","valor":0.012185,"tol":1e-05,"dec":6},{"nombre":"q<sub>g</sub> (kg/m)","clave":"qg","valor":18.27,"tol":0.01},{"nombre":"F<sub>u</sub> (N)","clave":"Fu","valor":1068.56,"tol":0.2},{"nombre":"P motor (kW)","clave":"Peje_kW","valor":1.91,"tol":0.005}],"casillas":["material","rho","talud","categoria","tamano","granulometria","Q","L","H","estacion","lambda","eta","C","qb","qRO","qRU","lsup","linf","R","thetaDeg","f","B","v"]}]};

let datos = DATOS_POR_DEFECTO;

// ---------------------------------------------------------------------------
// 1. Utilidades
// ---------------------------------------------------------------------------

// Escribe un número con coma decimal y separa los miles a partir de 10 000.
function num(valor, decimales = 2) {
  if (!Number.isFinite(valor)) return "—";
  const texto = Math.abs(valor).toFixed(decimales).split(".");
  if (texto[0].length > 4) texto[0] = texto[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const signo = valor < 0 && Number(valor.toFixed(decimales)) !== 0 ? "−" : "";
  return signo + texto.join(",");
}

const aRad = grados => grados * Math.PI / 180;
const aGrados = radianes => radianes * 180 / Math.PI;

// Interpolación lineal en una tabla de pares [x, y], limitada a sus extremos.
function interpolar(tabla, x) {
  if (x <= tabla[0][0]) return tabla[0][1];
  for (let i = 1; i < tabla.length; i++) {
    if (x <= tabla[i][0]) {
      const [x1, y1] = tabla[i - 1];
      const [x2, y2] = tabla[i];
      return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
    }
  }
  return tabla[tabla.length - 1][1];
}

function coeficienteSeguridad(z, tablas) {
  let S = tablas.seguridad[0].S;
  tablas.seguridad.forEach(fila => { if (z >= fila.desde) S = fila.S; });
  return S;
}

// ---------------------------------------------------------------------------
// 2. Capacidad de transporte (capítulo 1 de los apuntes)
// ---------------------------------------------------------------------------

// Sección transversal S = S1 + S2. Longitudes en m, ángulos en grados.
function seccionTransversal(B_mm, estacion, lambdaDeg, taludDeg, tablas) {
  const BM = B_mm / 1000;
  const b = BM <= 2 ? 0.9 * BM - 0.05 : BM - 0.2;
  const fila = tablas.rodillos.find(item => item.B === B_mm);
  let l3 = 0;
  if (estacion === 3) {
    if (!fila || !fila.tres) return null;
    l3 = fila.tres / 1000;
  }
  const lambda = estacion === 1 ? 0 : aRad(lambdaDeg);
  const talud = aRad(taludDeg);
  const S1 = Math.pow(l3 + (b - l3) * Math.cos(lambda), 2) * Math.tan(talud) / 6;
  const S2 = (l3 + (b - l3) / 2 * Math.cos(lambda)) * ((b - l3) / 2 * Math.sin(lambda));
  return { b, l3, S1, S2, S: S1 + S2 };
}

// Caudal volumétrico a 1 m/s de las tablas de Rulmeca, interpolando en el ángulo de sobrecarga.
function caudalTabla(B_mm, estacion, lambdaDeg, taludDeg, tablas) {
  const cap = tablas.capacidadRulmeca;
  let filas = null;
  if (estacion === 1 || lambdaDeg === 0) filas = cap.plana;
  if (estacion === 2 && lambdaDeg === 20) filas = cap.dosRodillosLambda20;
  if (estacion === 3 && cap.tresRodillos[String(lambdaDeg)]) filas = cap.tresRodillos[String(lambdaDeg)];
  if (!filas || !filas[String(B_mm)]) return null;
  const pares = cap.sobrecarga.map((beta, i) => [beta, filas[String(B_mm)][i]]);
  return interpolar(pares, taludDeg);
}

// Capacidad en t/h de una combinación de banda y velocidad.
function capacidad(e, B_mm, v, K, tablas) {
  const rhoT = e.rho / 1000; // t/m³
  if (e.metodoCap === "volumetrico") {
    const Qv1 = caudalTabla(B_mm, e.estacion, e.lambda, e.talud, tablas);
    if (Qv1 === null) return null;
    return { Qv1, seccion: seccionTransversal(B_mm, e.estacion, e.lambda, e.talud, tablas), Qcap: Qv1 * v * rhoT * K };
  }
  const seccion = seccionTransversal(B_mm, e.estacion, e.lambda, e.talud, tablas);
  if (seccion === null) return null;
  return { Qv1: null, seccion, Qcap: 3.6 * seccion.S * v * e.rho * K };
}

// Anchura mínima por tamaño de bulto: Tabla 1.2 (factor) y Tabla 1.3 (tamaño máximo).
function anchuraMinima(e, tablas) {
  const grupo = e.talud <= 20 ? tablas.factorGranulometria.hasta20 : tablas.factorGranulometria.hasta30;
  const factor = grupo[e.granulometria];
  const porFactor = factor * e.tamano;
  const filaTamano = tablas.bandas.find(fila => fila[e.granulometria] >= e.tamano);
  const porTamano = filaTamano ? filaTamano.B : Infinity;
  const requerida = Math.max(porFactor, porTamano);
  const fila = tablas.bandas.find(item => item.B >= requerida);
  return { factor, porFactor, porTamano, Bmin: fila ? fila.B : null };
}

// Elige la banda más estrecha y, para ella, la velocidad normalizada más baja que da la capacidad.
// Si B o v están fijados por el usuario se respetan; las comprobaciones avisan si no cumplen.
function elegirBandaYVelocidad(e, K, Bmin, tablas) {
  for (const fila of tablas.bandas) {
    if (e.fijoB ? fila.B !== e.fijoB : fila.B < Bmin) continue;
    const vmax = fila.vmax[e.categoria];
    const candidatas = e.fijoV ? [e.fijoV] : tablas.velocidades.filter(v => v <= vmax);
    for (const v of candidatas) {
      const c = capacidad(e, fila.B, v, K, tablas);
      if (c && c.Qcap >= e.Q) return { B: fila.B, v };
    }
    if (e.fijoB) return { B: e.fijoB, v: e.fijoV || vmax };
  }
  return null;
}

// ---------------------------------------------------------------------------
// 3. Cálculo completo de la cinta
// ---------------------------------------------------------------------------

function calcular(e, tablas) {
  const g = tablas.g;
  const pasos = [];
  const checks = [];
  const avisos = [];
  const seccion = titulo => pasos.push({ seccion: titulo });
  const paso = (nombre, formula, resultado) => pasos.push({ nombre, formula, resultado });
  const check = (ok, texto) => checks.push({ ok, texto });
  const r = { pasos, checks, avisos };

  // Inclinación y factor K.
  const senDelta = e.H / e.L;
  const delta = Math.asin(senDelta);
  const deltaDeg = aGrados(delta);
  const cosDelta = Math.cos(delta);
  const K = interpolar(tablas.factorK, Math.abs(deltaDeg));
  r.deltaDeg = deltaDeg;
  r.cosDelta = cosDelta;

  seccion("Geometría");
  paso("Inclinación δ", `sen δ = H/L = ${num(e.H, 2)} / ${num(e.L, 2)} = ${num(senDelta, 4)}`, `δ = ${num(deltaDeg, 2)}°`);

  // Selección o lectura de banda y velocidad.
  const conCarga = e.modo === "dimensionar" || e.datoCarga === "Q";
  let B = e.B;
  let v = e.v;
  let qg;
  let Q = e.Q;

  if (conCarga) {
    seccion("Capacidad de transporte");
    if (Math.abs(deltaDeg) > 30) avisos.push("La inclinación supera los 30° de la tabla de K; se ha tomado K en el extremo de la tabla.");
    paso("Factor de inclinación K", `Tabla de K, interpolando linealmente para |δ| = ${num(Math.abs(deltaDeg), 2)}°`, `K = ${num(K, 3)}`);

    if (e.metodoCap === "volumetrico" && (e.talud < 5 || e.talud > 30)) avisos.push("Las tablas de Rulmeca cubren θ de 5° a 30°; fuera de ese rango se usa el valor del extremo.");
    const minima = anchuraMinima(e, tablas);
    if (e.talud > 30) avisos.push("El ángulo de sobrecarga supera los 30° de la Tabla 1.2; se ha usado la fila de 20° a 30°.");
    paso("Anchura mínima por bulto", `Factor · tamaño = ${minima.factor} · ${num(e.tamano, 0)} = ${num(minima.porFactor, 0)} mm; Tabla 1.3 (${e.granulometria}): ${Number.isFinite(minima.porTamano) ? num(minima.porTamano, 0) + " mm" : "fuera de tabla"}`, minima.Bmin ? `B ≥ ${num(minima.Bmin, 0)} mm` : "Fuera de tabla");
    r.Bmin = minima.Bmin;

    if (e.modo === "dimensionar") {
      if (minima.Bmin === null && !e.fijoB) {
        r.error = "El tamaño de bulto exige una banda mayor que la máxima de la Tabla 1.3 (2200 mm).";
        return r;
      }
      const eleccion = elegirBandaYVelocidad(e, K, minima.Bmin, tablas);
      if (!eleccion) {
        r.error = "Ninguna banda de la Tabla 1.3 alcanza la capacidad pedida con estos datos. Prueba otra categoría de material, otra estación de rodillos u otro método.";
        return r;
      }
      B = eleccion.B;
      v = eleccion.v;
      paso("Banda y velocidad elegidas", e.fijoB || e.fijoV ? "Se respeta el valor fijado; el otro se elige con la Tabla 1.3" : "La banda más estrecha de la Tabla 1.3 que da la capacidad, con la velocidad normalizada más baja que la alcanza", `B = ${num(B, 0)} mm · v = ${num(v, 2)} m/s`);
    }

    const c = capacidad(e, B, v, K, tablas);
    if (c === null) {
      r.error = e.metodoCap === "volumetrico"
        ? `Las tablas de Rulmeca no incluyen esta combinación (B = ${num(B, 0)} mm, ${e.estacion} rodillo(s), λ = ${num(e.lambda, 0)}°). Usa el método de flujo másico u otra combinación.`
        : `La tabla de rodillos no incluye una estación de 3 rodillos para B = ${num(B, 0)} mm.`;
      return r;
    }
    if (e.metodoCap === "volumetrico") {
      paso("Caudal a 1 m/s", `Tabla Rulmeca, ${e.estacion} rodillo(s), λ = ${num(e.estacion === 1 ? 0 : e.lambda, 0)}°, interpolando en θ = ${num(e.talud, 1)}°`, `Q<sub>v</sub> = ${num(c.Qv1, 2)} m³/h`);
      paso("Capacidad", `Q = Q<sub>v</sub> · v · ρ · K = ${num(c.Qv1, 2)} · ${num(v, 2)} · ${num(e.rho / 1000, 3)} · ${num(K, 3)}`, `${num(c.Qcap, 2)} t/h`);
    } else {
      const s = c.seccion;
      const l = e.estacion === 1 ? 0 : e.lambda;
      paso("Anchura útil b", B / 1000 <= 2 ? `b = 0,9·B − 0,05 = 0,9 · ${num(B / 1000, 3)} − 0,05` : `b = B − 0,2 = ${num(B / 1000, 3)} − 0,2`, `${num(s.b, 3)} m`);
      paso("Rodillo central l₃", e.estacion === 3 ? `Tabla de rodillos para B = ${num(B, 0)} mm` : "Con 1 o 2 rodillos, l₃ = 0", `${num(s.l3, 3)} m`);
      paso("Sección S₁", `S₁ = (l₃ + (b − l₃)·cos λ)²·tg θ/6 = (${num(s.l3, 3)} + ${num(s.b - s.l3, 3)}·cos ${num(l, 1)}°)²·tg ${num(e.talud, 1)}°/6`, `${num(s.S1, 5)} m²`);
      paso("Sección S₂", `S₂ = (l₃ + (b − l₃)/2·cos λ)·((b − l₃)/2·sen λ) = (${num(s.l3, 3)} + ${num((s.b - s.l3) / 2, 4)}·cos ${num(l, 1)}°)·(${num((s.b - s.l3) / 2, 4)}·sen ${num(l, 1)}°)`, `${num(s.S2, 5)} m²`);
      paso("Sección total S", `S = S₁ + S₂ = ${num(s.S1, 5)} + ${num(s.S2, 5)}`, `${num(s.S, 5)} m²`);
      paso("Capacidad", `Q = 3,6·S·v·ρ·K = 3,6 · ${num(s.S, 5)} · ${num(v, 2)} · ${num(e.rho, 0)} · ${num(K, 3)}`, `${num(c.Qcap, 2)} t/h`);
    }
    r.Qcap = c.Qcap;
    r.seccion = c.seccion;
    r.K = K;
    check(c.Qcap >= Q, `Capacidad: ${num(c.Qcap, 2)} t/h ${c.Qcap >= Q ? "≥" : "<"} ${num(Q, 2)} t/h requeridas`);

    if (minima.Bmin !== null) check(B >= minima.Bmin, `Tamaño de bulto: B = ${num(B, 0)} mm ${B >= minima.Bmin ? "≥" : "<"} ${num(minima.Bmin, 0)} mm`);
    else check(false, "Tamaño de bulto: exige una banda mayor que la máxima de la Tabla 1.3");

    const filaBanda = [...tablas.bandas].reverse().find(fila => fila.B <= B);
    if (filaBanda) {
      const vmax = filaBanda.vmax[e.categoria];
      check(v <= vmax, `Velocidad: ${num(v, 2)} m/s ${v <= vmax ? "≤" : ">"} ${num(vmax, 2)} m/s (Tabla 1.3, B = ${num(filaBanda.B, 0)} mm, categoría ${e.categoria})`);
    } else {
      avisos.push(`B = ${num(B, 0)} mm es menor que la primera anchura de la Tabla 1.3 (400 mm): no se ha comprobado la velocidad máxima.`);
    }
    qg = Q / (3.6 * v);
    paso("Masa lineal de material", `q<sub>g</sub> = Q/(3,6·v) = ${num(Q, 2)} / (3,6 · ${num(v, 2)})`, `${num(qg, 2)} kg/m`);
  } else {
    qg = e.qgDato;
    Q = 3.6 * qg * v;
    avisos.push("Con q<sub>g</sub> como dato no se comprueba la capacidad: la estación de rodillos, λ y θ solo cambian el dibujo de la sección, no F<sub>u</sub> ni las tensiones.");
    if (e.talud >= 0 && (e.estacion === 1 || e.lambda >= 0)) {
      const seccionDibujo = seccionTransversal(B, e.estacion, e.lambda, e.talud, tablas);
      if (seccionDibujo) r.seccion = seccionDibujo;
    }
    seccion("Carga");
    paso("Caudal másico equivalente", `Q = 3,6·q<sub>g</sub>·v = 3,6 · ${num(qg, 2)} · ${num(v, 2)}`, `${num(Q, 2)} t/h`);
  }

  if (!tablas.velocidades.includes(v)) {
    avisos.push(`v = ${num(v, 2)} m/s no es una velocidad normalizada de DIN 22101 (Tabla 1.4).`);
  }

  r.B = B;
  r.v = v;
  r.qg = qg;
  r.Q = Q;

  // Resistencias al avance.
  seccion("Resistencias al avance");
  const qR = e.qRO + e.qRU;
  const corchete = qR + (2 * e.qb + qg) * cosDelta;
  paso("Término de masas", `q<sub>R</sub> + (2q<sub>b</sub> + q<sub>g</sub>)·cos δ = ${num(qR, 3)} + (2 · ${num(e.qb, 2)} + ${num(qg, 2)}) · ${num(cosDelta, 5)}`, `${num(corchete, 3)} kg/m`);

  const simplificado = e.L > 80;
  let Lcalculo = e.L;
  let FHN;
  if (simplificado) {
    const C = e.usoC === "manual" ? e.C : interpolar(tablas.coeficienteC, e.L);
    Lcalculo = C * e.L;
    if (e.usoC !== "manual" && e.L > 500) avisos.push("L supera los 500 m de la tabla de C; se ha usado el último valor (C = 1,05).");
    paso("Longitud corregida (L > 80 m)", `L<sub>C</sub> = C·L = ${num(C, 3)} · ${num(e.L, 2)}`, `${num(Lcalculo, 2)} m`);
    FHN = e.f * Lcalculo * g * corchete;
    paso("Principales y secundarias", `F<sub>H</sub> + F<sub>N</sub> = f·L<sub>C</sub>·g·[…] = ${num(e.f, 4)} · ${num(Lcalculo, 2)} · ${num(g, 2)} · ${num(corchete, 3)}`, `${num(FHN, 2)} N`);
    r.C = C;
  } else {
    const FH = e.f * e.L * g * corchete;
    paso("Principales F<sub>H</sub> (L ≤ 80 m)", `F<sub>H</sub> = f·L·g·[…] = ${num(e.f, 4)} · ${num(e.L, 2)} · ${num(g, 2)} · ${num(corchete, 3)}`, `${num(FH, 2)} N`);
    if (e.vent > v) avisos.push("La velocidad de entrada del material supera v: F<sub>N,acc</sub> sale negativa.");
    const mPunto = qg * v;
    const FNacc = mPunto * (v - e.vent);
    const FN = FNacc + e.FNtamb;
    paso("Aceleración del material", `F<sub>N,acc</sub> = q<sub>g</sub>·v·(v − v<sub>ent</sub>) = ${num(qg, 2)} · ${num(v, 2)} · (${num(v, 2)} − ${num(e.vent, 2)})`, `${num(FNacc, 2)} N`);
    paso("Secundarias F<sub>N</sub>", `F<sub>N</sub> = F<sub>N,acc</sub> + F<sub>N,tamb</sub> = ${num(FNacc, 2)} + ${num(e.FNtamb, 2)}`, `${num(FN, 2)} N`);
    FHN = FH + FN;
  }
  const FSt = qg * g * e.H;
  paso("Elevación F<sub>St</sub>", `F<sub>St</sub> = q<sub>g</sub>·g·H = ${num(qg, 2)} · ${num(g, 2)} · ${num(e.H, 2)}`, `${num(FSt, 2)} N`);
  let Fu = FHN + e.FS1 + e.FS2 + FSt;
  paso("Fuerza periférica F<sub>u</sub>", `F<sub>u</sub> = (F<sub>H</sub> + F<sub>N</sub>) + F<sub>S1</sub> + F<sub>S2</sub> + F<sub>St</sub> = ${num(FHN, 2)} + ${num(e.FS1, 2)} + ${num(e.FS2, 2)} + ${num(FSt, 2)}`, `${num(Fu, 2)} N`);
  if (e.FuDato > 0) {
    Fu = e.FuDato;
    paso("F<sub>u</sub> conocida", "Dato del enunciado: sustituye a la F<sub>u</sub> calculada", `${num(Fu, 2)} N`);
  }
  r.FHN = FHN;
  r.FSt = FSt;
  r.Fu = Fu;

  if (Fu <= 0) {
    r.error = `F<sub>u</sub> = ${num(Fu, 2)} N ≤ 0: la gravedad arrastra la cinta y el tambor tendría que frenar. Este caso necesita un sistema de frenado y queda fuera del modelo de la aplicación.`;
    return r;
  }

  // Potencia, par y giro.
  seccion("Potencia, par y velocidad de giro");
  const Pu = Fu * v;
  const Peje = Pu / e.eta;
  const M = Fu * e.r;
  const omega = v / e.r;
  const n = omega * 60 / (2 * Math.PI);
  paso("Potencia útil P<sub>u</sub>", `P<sub>u</sub> = F<sub>u</sub>·v = ${num(Fu, 2)} · ${num(v, 2)}`, `${num(Pu / 1000, 2)} kW`);
  paso("Potencia en el eje del motor", `P<sub>eje</sub> = P<sub>u</sub>/η = ${num(Pu / 1000, 3)} / ${num(e.eta, 3)}`, `${num(Peje / 1000, 2)} kW`);
  paso("Par en el tambor", `M = F<sub>u</sub>·r = ${num(Fu, 2)} · ${num(e.r, 3)}`, `${num(M, 2)} N·m`);
  paso("Velocidad angular", `ω = v/r = ${num(v, 2)} / ${num(e.r, 3)}`, `${num(omega, 2)} rad/s`);
  paso("Velocidad de giro", `n = 60·ω/(2π) = 60 · ${num(omega, 2)} / (2π)`, `${num(n, 1)} rpm`);
  Object.assign(r, { Pu, Peje, M, omega, n });

  // Tensiones mínimas.
  seccion("Tensiones mínimas");
  const theta = aRad(e.thetaDeg);
  const kEuler = Math.exp(e.mu * theta);
  const T2adh = Fu / (kEuler - 1);
  const hRelMax = e.hmax / 100;
  const qSup = e.qb + qg;
  const TsupMin = qSup * g * cosDelta * e.lsup / (8 * hRelMax);
  const TinfMin = e.qb * g * cosDelta * e.linf / (8 * hRelMax);
  const deltaRetorno = e.f * Lcalculo * g * (e.qRU + e.qb * cosDelta) - e.qb * g * e.H;
  paso("Límite de Euler-Eytelwein", `e<sup>μφ</sup> = e^(${num(e.mu, 3)} · ${num(theta, 4)})`, num(kEuler, 4));
  paso("T₂ mínima por adherencia", `T₂ ≥ F<sub>u</sub>/(e<sup>μφ</sup> − 1) = ${num(Fu, 2)} / (${num(kEuler, 4)} − 1)`, `${num(T2adh, 2)} N`);
  paso("T mínima por flecha, portante", `T = (q<sub>b</sub> + q<sub>g</sub>)·g·cos δ·l<sub>R</sub>/(8·h<sub>rel</sub>) = ${num(qSup, 2)} · ${num(g, 2)} · ${num(cosDelta, 5)} · ${num(e.lsup, 2)} / (8 · ${num(hRelMax, 4)})`, `${num(TsupMin, 2)} N`);
  paso("T mínima por flecha, retorno", `T = q<sub>b</sub>·g·cos δ·l<sub>R</sub>/(8·h<sub>rel</sub>) = ${num(e.qb, 2)} · ${num(g, 2)} · ${num(cosDelta, 5)} · ${num(e.linf, 2)} / (8 · ${num(hRelMax, 4)})`, `${num(TinfMin, 2)} N`);

  const recorrido = e.modoLocal === "recorrido";
  if (recorrido) {
    paso("Variación en el retorno ΔT", `ΔT = f·L·g·(q<sub>RU</sub> + q<sub>b</sub>·cos δ) − q<sub>b</sub>·g·H = ${num(e.f, 4)} · ${num(Lcalculo, 2)} · ${num(g, 2)} · (${num(e.qRU, 3)} + ${num(e.qb, 2)} · ${num(cosDelta, 5)}) − ${num(e.qb, 2)} · ${num(g, 2)} · ${num(e.H, 2)}`, `${num(deltaRetorno, 2)} N`);
  }
  const T2flecha = recorrido
    ? Math.max(TinfMin, TinfMin - deltaRetorno, TsupMin - deltaRetorno, TsupMin - Fu)
    : TinfMin;
  paso("T₂ mínima por flecha", recorrido
    ? `Para que los dos ramales cumplan en su punto más flojo = máx(T<sub>ret</sub>, T<sub>ret</sub> − ΔT, T<sub>port</sub> − ΔT, T<sub>port</sub> − F<sub>u</sub>)`
    : "T₂ está en el ramal de retorno: T₂ ≥ T mínima del retorno", `${num(T2flecha, 2)} N`);
  const T2req = Math.max(T2adh, T2flecha);
  paso("T₂ mínima de diseño", `T₂,mín = máx(T₂,adh; T₂,flecha) = máx(${num(T2adh, 2)}; ${num(T2flecha, 2)})`, `${num(T2req, 2)} N`);
  r.T2adh = T2adh;
  r.T2flecha = T2flecha;
  r.T2req = T2req;
  r.TsupMin = TsupMin;
  r.TinfMin = TinfMin;
  r.kEuler = kEuler;

  // Tensiones adoptadas.
  seccion("Tensiones adoptadas y adherencia");
  let T2 = e.T2;
  if (e.modoT2 === "auto") {
    const objetivo = Math.max(T2adh * (1 + e.margen / 100), T2flecha);
    T2 = Math.ceil(objetivo / 100 - 1e-9) * 100;
    paso("T₂ adoptada", `Máx(T₂,adh · (1 + margen); T₂,flecha) = máx(${num(T2adh, 2)} · ${num(1 + e.margen / 100, 3)}; ${num(T2flecha, 2)}), redondeada a la centena superior`, `${num(T2, 0)} N`);
  } else {
    paso("T₂ adoptada", "Valor elegido por el usuario", `${num(T2, 2)} N`);
  }
  const T1 = T2 + Fu;
  const relacion = T1 / T2;
  const FuMax = T2 * (kEuler - 1);
  const reserva = FuMax / Fu - 1;
  const thetaMinDeg = aGrados(Math.log(Fu / T2 + 1) / e.mu);
  paso("Ramal tenso T₁", `T₁ = T₂ + F<sub>u</sub> = ${num(T2, 2)} + ${num(Fu, 2)}`, `${num(T1, 2)} N`);
  paso("Relación real de tensiones", `T₁/T₂ = ${num(T1, 2)} / ${num(T2, 2)}`, num(relacion, 4));
  paso("Fuerza máxima transmisible", `F<sub>u,máx</sub> = T₂·(e<sup>μφ</sup> − 1) = ${num(T2, 2)} · (${num(kEuler, 4)} − 1)`, `${num(FuMax, 2)} N`);
  paso("Reserva frente al deslizamiento", `R<sub>adh</sub> = F<sub>u,máx</sub>/F<sub>u</sub> − 1 = ${num(FuMax, 2)} / ${num(Fu, 2)} − 1`, `${num(reserva * 100, 1)} %`);
  check(relacion <= kEuler, `Adherencia: T₁/T₂ = ${num(relacion, 4)} ${relacion <= kEuler ? "≤" : ">"} e^μφ = ${num(kEuler, 4)} (reserva ${num(reserva * 100, 1)} %)`);
  if (relacion > kEuler) {
    avisos.push(`La banda patina. Soluciones: subir T₂ al menos a ${num(T2adh, 0)} N o subir el ángulo abrazado al menos a ${num(thetaMinDeg, 1)}° con un tambor de reenvío.`);
  }
  Object.assign(r, { T2, T1, relacion, FuMax, reserva, thetaMinDeg });

  // Flecha.
  seccion("Flecha entre rodillos");
  const Tcola = T2 + deltaRetorno;
  let TsupLocal = e.Tsup;
  let TinfLocal = e.Tinf;
  if (recorrido) {
    TinfLocal = Math.min(T2, Tcola);
    TsupLocal = Math.min(Tcola, T1);
    paso("Tensión en el tambor de cola", `T<sub>cola</sub> = T₂ + ΔT = ${num(T2, 2)} + ${num(deltaRetorno, 2)}`, `${num(Tcola, 2)} N`);
    paso("T local de cálculo, portante", `Mínima del ramal = mín(T<sub>cola</sub>; T₁) = mín(${num(Tcola, 2)}; ${num(T1, 2)})`, `${num(TsupLocal, 2)} N`);
    paso("T local de cálculo, retorno", `Mínima del ramal = mín(T₂; T<sub>cola</sub>) = mín(${num(T2, 2)}; ${num(Tcola, 2)})`, `${num(TinfLocal, 2)} N`);
  } else {
    paso("T locales adoptadas", "Valores elegidos por el usuario", `${num(TsupLocal, 0)} y ${num(TinfLocal, 0)} N`);
  }
  r.Tcola = recorrido ? Tcola : null;
  r.TcolaCalculada = Tcola;
  r.TsupLocal = TsupLocal;
  r.TinfLocal = TinfLocal;

  if (TsupLocal <= 0 || TinfLocal <= 0) {
    check(false, "Flecha: la tensión local se anula. Hay que aumentar T₂.");
  } else {
    const hSup = qSup * g * cosDelta * e.lsup * e.lsup / (8 * TsupLocal);
    const hInf = e.qb * g * cosDelta * e.linf * e.linf / (8 * TinfLocal);
    const relSup = hSup / e.lsup;
    const relInf = hInf / e.linf;
    paso("Flecha, portante", `h = q·g·cos δ·l<sub>R</sub>²/(8T) = ${num(qSup, 2)} · ${num(g, 2)} · ${num(cosDelta, 5)} · ${num(e.lsup, 2)}² / (8 · ${num(TsupLocal, 2)})`, `${num(hSup * 1000, 2)} mm → ${num(relSup * 100, 2)} %`);
    paso("Flecha, retorno", `h = q·g·cos δ·l<sub>R</sub>²/(8T) = ${num(e.qb, 2)} · ${num(g, 2)} · ${num(cosDelta, 5)} · ${num(e.linf, 2)}² / (8 · ${num(TinfLocal, 2)})`, `${num(hInf * 1000, 2)} mm → ${num(relInf * 100, 2)} %`);
    check(relSup <= hRelMax, `Flecha del portante: ${num(relSup * 100, 2)} % ${relSup <= hRelMax ? "≤" : ">"} ${num(e.hmax, 2)} % con T = ${num(TsupLocal, 0)} N (mínima ${num(TsupMin, 0)} N)`);
    check(relInf <= hRelMax, `Flecha del retorno: ${num(relInf * 100, 2)} % ${relInf <= hRelMax ? "≤" : ">"} ${num(e.hmax, 2)} % con T = ${num(TinfLocal, 0)} N (mínima ${num(TinfMin, 0)} N)`);
    Object.assign(r, { hSup, hInf, relSup, relInf });
    if (!recorrido) {
      avisos.push("Las tensiones locales las has adoptado tú. Elige «Calculadas» para comprobar la flecha en el punto más flojo de cada ramal.");
    } else if (relSup > hRelMax || relInf > hRelMax) {
      avisos.push(`Para cumplir la flecha en los dos ramales hace falta T₂ ≥ ${num(T2flecha, 0)} N.`);
    }
  }

  // Número de capas.
  seccion("Selección de la banda");
  const Tmax = e.TmaxDato > 0 ? e.TmaxDato : T1;
  if (e.TmaxDato > 0) paso("T<sub>máx</sub> conocida", "Dato del enunciado: sustituye a T₁ en la selección de la banda", `${num(Tmax, 2)} N`);
  let z = Math.max(1, Math.ceil(e.zmin));
  while (z < 60 && e.R * z * B / coeficienteSeguridad(z, tablas) < Tmax) z++;
  const S = coeficienteSeguridad(z, tablas);
  const zTeorico = S * Tmax / (e.R * B);
  const Tadm = e.R * z * B / S;
  paso("Capas necesarias", `z ≥ S·T<sub>máx</sub>/(R·B) = ${num(S, 0)} · ${num(Tmax, 2)} / (${num(e.R, 0)} · ${num(B, 0)}), con S según z`, num(zTeorico, 3));
  paso("Capas adoptadas", `Entero superior, con el mínimo constructivo de ${num(Math.ceil(e.zmin), 0)} capas`, `z = ${z}`);
  paso("Tensión admisible", `T<sub>adm</sub> = R·z·B/S = ${num(e.R, 0)} · ${z} · ${num(B, 0)} / ${num(S, 0)}`, `${num(Tadm, 0)} N`);
  check(Tmax <= Tadm, `Resistencia: T<sub>máx</sub> = ${num(Tmax, 0)} N ${Tmax <= Tadm ? "≤" : ">"} T<sub>adm</sub> = ${num(Tadm, 0)} N con ${z} capas`);
  Object.assign(r, { z, S, zTeorico, Tadm });

  return r;
}

// Propone qué cambiar cuando el diseño no cumple. Cada consejo lleva los valores estimados
// (aplica) y las casillas que hay que iluminar en rojo (campos).
function consejosRediseno(e, r, tablas) {
  const salida = [];
  const arriba = (x, paso) => Math.ceil(x / paso - 1e-9) * paso;
  const abajo = (x, paso) => Math.floor(x / paso + 1e-9) * paso;
  const campoB = e.modo === "comprobar" ? "B" : "selB";
  const campoV = e.modo === "comprobar" ? "v" : "selV";
  const fallo = prefijo => r.checks.some(c => c.texto.startsWith(prefijo) && !c.ok);
  const nuevo = (titulo, texto, aplica, extra = []) => salida.push({ titulo, texto, aplica, campos: [...Object.keys(aplica), ...extra] });
  const manualT2 = valor => ({ modoT2: "manual", T2: valor });

  // Banda y velocidad normalizadas que cumplen capacidad, tamaño de bulto y velocidad máxima.
  const buscarBanda = (desde, K) => {
    for (const fila of tablas.bandas) {
      if (fila.B < desde) continue;
      for (const v of tablas.velocidades) {
        if (v > fila.vmax[e.categoria]) break;
        const c = capacidad(e, fila.B, v, K, tablas);
        if (c && c.Qcap >= e.Q) return { B: fila.B, v, Qcap: c.Qcap };
      }
    }
    return null;
  };
  const K = interpolar(tablas.factorK, Math.abs(r.deltaDeg || 0));

  // Mayor tamaño de bulto que admiten las Tablas 1.2 y 1.3 con la banda más ancha.
  const tamanoAdmisible = () => {
    const grupo = e.talud <= 20 ? tablas.factorGranulometria.hasta20 : tablas.factorGranulometria.hasta30;
    const ultima = tablas.bandas[tablas.bandas.length - 1];
    return Math.floor(Math.min(ultima.B / grupo[e.granulometria], ultima[e.granulometria]));
  };

  if (r.error) {
    if (r.Fu !== undefined && r.Fu <= 0) {
      const Hmin = -(r.FHN + (e.FS1 || 0) + (e.FS2 || 0)) / (r.qg * tablas.g);
      nuevo("Reducir la bajada", `Para que F<sub>u</sub> sea positiva, H debe ser mayor que ${num(Hmin, 2)} m. También puede instalarse un freno.`, { H: Number(arriba(Hmin + 0.1, 0.5).toFixed(1)) });
      return salida;
    }
    const conCarga = e.modo === "dimensionar" || e.datoCarga === "Q";
    if (r.Bmin === null) {
      nuevo("Reducir el tamaño de bulto", `Con esta granulometría y este θ, el tamaño máximo que admite la Tabla 1.3 es ${num(tamanoAdmisible(), 0)} mm.`, { tamano: tamanoAdmisible() });
      return salida;
    }
    if (conCarga) {
      let maximo = 0;
      for (const fila of tablas.bandas) {
        const c = capacidad(e, fila.B, fila.vmax[e.categoria], K, tablas);
        if (c && c.Qcap > maximo) maximo = c.Qcap;
      }
      if (maximo > 0 && maximo < e.Q) {
        nuevo("Reducir la capacidad pedida", `Con este material y esta estación, la mayor capacidad de la Tabla 1.3 es ${num(maximo, 1)} t/h.`, { Q: abajo(maximo, 1) });
      } else if (e.fijoB || e.fijoV) {
        nuevo("Dejar B y v en automático", "Los valores fijados no tienen solución con esta tabla.", { selB: "auto", selV: "auto" });
      } else if (e.metodoCap === "volumetrico") {
        nuevo("Cambiar de método", "Las tablas de Rulmeca no incluyen esta combinación; el método de flujo másico admite cualquier λ.", { metodoCap: "masico" });
      }
    }
    return salida;
  }

  if (fallo("Capacidad") || fallo("Tamaño de bulto") || fallo("Velocidad")) {
    const K2 = r.K !== undefined ? r.K : K;
    const sinBanda = r.Bmin === null;
    const tamano = sinBanda ? tamanoAdmisible() : null;
    const grupo = e.talud <= 20 ? tablas.factorGranulometria.hasta20 : tablas.factorGranulometria.hasta30;
    const desde = sinBanda ? grupo[e.granulometria] * tamano : Math.max(r.Bmin || 0, r.B);
    const propuesta = buscarBanda(desde, K2);
    if (propuesta) {
      nuevo("Cambiar la banda y la velocidad", `Con B = ${num(propuesta.B, 0)} mm y v = ${num(propuesta.v, 2)} m/s se obtienen ${num(propuesta.Qcap, 1)} t/h y se respetan el tamaño de bulto y la velocidad máxima.`, { [campoB]: propuesta.B, [campoV]: propuesta.v, ...(sinBanda ? { tamano } : {}) });
    } else {
      nuevo("No hay banda válida en la Tabla 1.3", "Reduce la capacidad pedida o el tamaño de bulto, o cambia de categoría o de estación de rodillos.", {}, ["Q", "tamano", "categoria", "estacion"]);
    }
  }

  if (fallo("Adherencia")) {
    const T2 = arriba(r.T2adh * 1.15, 100);
    nuevo("Subir T₂", `T₂ mínima = ${num(r.T2adh, 0)} N. Con un 15 % de margen: T₂ = ${num(T2, 0)} N. Sube la tensión en toda la banda.`, manualT2(T2));
    const phi = arriba(r.thetaMinDeg, 5);
    if (phi <= 360) nuevo("Subir el ángulo abrazado", `φ mínimo = ${num(r.thetaMinDeg, 1)}°. Propuesta: φ = ${num(phi, 0)}°, con un tambor de reenvío.`, { thetaDeg: phi });
    const mu = arriba(Math.log(r.relacion) / aRad(e.thetaDeg), 0.01);
    nuevo("Mejorar el rozamiento", `μ mínimo = ${num(Math.log(r.relacion) / aRad(e.thetaDeg), 3)}. Propuesta: μ = ${num(mu, 2)}, con un recubrimiento mejor del tambor.`, { mu: Number(mu.toFixed(2)) });
  }

  if (fallo("Flecha:")) {
    const T2 = arriba(r.T2flecha, 100);
    nuevo("Subir T₂ por la tensión local", `La tensión se anula en algún punto de la banda. Hace falta T₂ ≥ ${num(r.T2flecha, 0)} N. Propuesta: T₂ = ${num(T2, 0)} N.`, manualT2(T2));
  }

  const flecha = (prefijo, nombre, min, campoT, campoL, q, l, Tlocal) => {
    if (!fallo(prefijo)) return;
    if (e.modoLocal === "manual") {
      const T = arriba(min, 100);
      nuevo(`Subir la tensión del ${nombre}`, `T mínima = ${num(min, 0)} N. Propuesta: T = ${num(T, 0)} N.`, { [campoT]: T });
    } else {
      const T2 = arriba(r.T2flecha, 100);
      nuevo(`Subir T₂ por la flecha del ${nombre}`, `Para cumplir en el punto más flojo hace falta T₂ ≥ ${num(r.T2flecha, 0)} N. Propuesta: T₂ = ${num(T2, 0)} N.`, manualT2(T2));
    }
    if (Tlocal > 0) {
      const lmax = 8 * (e.hmax / 100) * Tlocal / (q * tablas.g * r.cosDelta);
      const propuesta = abajo(lmax, 0.05);
      if (propuesta > 0) nuevo(`Acercar los rodillos del ${nombre}`, `Con T = ${num(Tlocal, 0)} N, la separación máxima es ${num(lmax, 3)} m. Propuesta: ${num(propuesta, 2)} m.`, { [campoL]: Number(propuesta.toFixed(2)) });
    }
  };
  flecha("Flecha del portante", "portante", r.TsupMin, "Tsup", "lsup", e.qb + r.qg, e.lsup, r.TsupLocal);
  flecha("Flecha del retorno", "retorno", r.TinfMin, "Tinf", "linf", e.qb, e.linf, r.TinfLocal);

  if (fallo("Resistencia")) {
    const Tmax = e.TmaxDato > 0 ? e.TmaxDato : r.T1;
    const R = arriba(r.S * Tmax / (r.z * r.B), 5);
    nuevo("Subir la resistencia por capa", `Con ${r.z} capas hace falta R ≥ ${num(r.S * Tmax / (r.z * r.B), 1)} N/mm. Propuesta: R = ${num(R, 0)} N/mm.`, { R });
  }
  return salida;
}

// Comprueba que los datos tienen sentido antes de calcular.
function validar(e) {
  const errores = [];
  const positivo = (valor, nombre, id) => {
    if (!Number.isFinite(valor) || valor <= 0) errores.push({ id, texto: `${nombre} debe ser mayor que 0.` });
  };
  const noNegativo = (valor, nombre, id) => {
    if (!Number.isFinite(valor) || valor < 0) errores.push({ id, texto: `${nombre} no puede ser negativo ni estar vacío.` });
  };
  const conCarga = e.modo === "dimensionar" || e.datoCarga === "Q";

  positivo(e.L, "L", "L");
  if (!Number.isFinite(e.H)) errores.push({ id: "H", texto: "H debe ser un número (0 si es horizontal)." });
  else if (Math.abs(e.H) >= e.L) errores.push({ id: "H", texto: "El valor absoluto de H debe ser menor que L." });
  if (e.modo === "comprobar") {
    positivo(e.B, "B", "B");
    positivo(e.v, "v", "v");
  }
  if (conCarga) {
    positivo(e.Q, "Q", "Q");
    positivo(e.rho, "La densidad", "rho");
    noNegativo(e.talud, "El ángulo de sobrecarga", "talud");
    if (e.talud >= 90) errores.push({ id: "talud", texto: "El ángulo de sobrecarga debe ser menor que 90°." });
    positivo(e.tamano, "El tamaño de bulto", "tamano");
    if (e.estacion !== 1) {
      noNegativo(e.lambda, "λ", "lambda");
      if (e.lambda >= 90) errores.push({ id: "lambda", texto: "λ debe ser menor que 90°." });
    }
  } else {
    positivo(e.qgDato, "q<sub>g</sub>", "qgDato");
  }
  positivo(e.f, "f", "f");
  positivo(e.qb, "q<sub>b</sub>", "qb");
  noNegativo(e.qRO, "q<sub>RO</sub>", "qRO");
  noNegativo(e.qRU, "q<sub>RU</sub>", "qRU");
  noNegativo(e.FS1, "F<sub>S1</sub>", "FS1");
  noNegativo(e.FS2, "F<sub>S2</sub>", "FS2");
  if (e.L > 80 && e.usoC === "manual") positivo(e.C, "C", "C");
  if (e.L <= 80) {
    noNegativo(e.vent, "La velocidad de entrada", "vent");
    noNegativo(e.FNtamb, "F<sub>N,tamb</sub>", "FNtamb");
  }
  positivo(e.eta, "η", "eta");
  if (e.eta > 1) errores.push({ id: "eta", texto: "η no puede ser mayor que 1 (escribe 0,90, no 90)." });
  positivo(e.r, "r", "r");
  positivo(e.mu, "μ", "mu");
  positivo(e.thetaDeg, "El ángulo abrazado", "thetaDeg");
  if (e.modoT2 === "auto") noNegativo(e.margen, "El margen", "margen");
  else positivo(e.T2, "T₂", "T2");
  if (e.modoLocal === "manual") {
    positivo(e.Tsup, "La T local del portante", "Tsup");
    positivo(e.Tinf, "La T local del retorno", "Tinf");
  }
  positivo(e.lsup, "La separación de rodillos portantes", "lsup");
  positivo(e.linf, "La separación de rodillos de retorno", "linf");
  positivo(e.hmax, "La flecha máxima", "hmax");
  positivo(e.R, "R", "R");
  positivo(e.zmin, "El mínimo de capas", "zmin");
  return errores;
}

// ---------------------------------------------------------------------------
// 3 bis. Ejercicios de la asignatura
// ---------------------------------------------------------------------------

// Resuelve un ejercicio y devuelve sus pasos y valores, para compararlos con lo publicado.
function resolverEjercicio(ej, tablas) {
  const d = ej.datos;
  const g = tablas.g;
  const lineas = [];
  const val = {};
  const linea = (nombre, formula, clave, valor, decimales, unidad = "") => {
    val[clave] = valor;
    lineas.push({ nombre, formula, resultado: `${num(valor, decimales)}${unidad ? " " + unidad : ""}` });
  };

  if (ej.tipo === "cinta") {
    const base = tablas.ejemplos.find(item => item.id === d.base).valores;
    const e = { ...base, ...d };
    e.estacion = Number(e.estacion);
    const r = calcular(e, tablas);
    r.pasos.forEach(p => lineas.push(p));
    Object.assign(val, r, { seccionS: r.seccion ? r.seccion.S : NaN, Pu_kW: r.Pu / 1000, Peje_kW: r.Peje / 1000, reservaPct: r.reserva * 100, relSupPct: r.relSup * 100, relInfPct: r.relInf * 100, hSupMm: r.hSup * 1000, hInfMm: r.hInf * 1000 });
  } else if (ej.tipo === "adherencia") {
    d.casos.forEach((caso, i) => {
      const k = Math.exp(d.mu * aRad(caso.phi));
      const sf = d.casos.length > 1 ? `_${i + 1}` : "";
      linea(`Límite con φ = ${num(caso.phi, 0)}°`, `e^(μφ) = e^(${num(d.mu, 2)} · ${num(aRad(caso.phi), 4)})`, "k" + sf, k, 4);
      linea("Fuerza máxima transmisible", `F<sub>u,máx</sub> = T₂·(e^μφ − 1) = ${num(caso.T2, 0)} · (${num(k, 4)} − 1)`, "FuMax" + sf, caso.T2 * (k - 1), 2, "N");
      linea("T₂ mínima por adherencia", `T₂ = F<sub>u</sub>/(e^μφ − 1) = ${num(d.Fu, 2)} / (${num(k, 4)} − 1)`, "T2min" + sf, d.Fu / (k - 1), 2, "N");
      linea("Ramal tenso", `T₁ = T₂ + F<sub>u</sub> = ${num(caso.T2, 0)} + ${num(d.Fu, 2)}`, "T1" + sf, caso.T2 + d.Fu, 2, "N");
      linea("Reserva", `R = F<sub>u,máx</sub>/F<sub>u</sub> − 1`, "reserva" + sf, (caso.T2 * (k - 1) / d.Fu - 1) * 100, 1, "%");
      linea("Ángulo mínimo", `φ = ln(F<sub>u</sub>/T₂ + 1)/μ = ln(${num(d.Fu, 2)} / ${num(caso.T2, 0)} + 1) / ${num(d.mu, 2)}`, "phiMin" + sf, aGrados(Math.log(d.Fu / caso.T2 + 1) / d.mu), 1, "°");
    });
  } else if (ej.tipo === "flecha") {
    const qs = d.qb + d.qg;
    linea("Flecha, portante", `h = ${num(qs, 0)} · ${num(g, 2)} · ${num(d.lsup, 2)}² / (8 · ${num(d.Tsup, 0)})`, "hSup", qs * g * d.lsup ** 2 / (8 * d.Tsup) * 1000, 2, "mm");
    linea("Flecha relativa, portante", `h/l<sub>R</sub>`, "relSup", qs * g * d.lsup / (8 * d.Tsup) * 100, 3, "%");
    linea("Flecha, retorno", `h = ${num(d.qb, 0)} · ${num(g, 2)} · ${num(d.linf, 2)}² / (8 · ${num(d.Tinf, 0)})`, "hInf", d.qb * g * d.linf ** 2 / (8 * d.Tinf) * 1000, 2, "mm");
    linea("Flecha relativa, retorno", `h/l<sub>R</sub>`, "relInf", d.qb * g * d.linf / (8 * d.Tinf) * 100, 3, "%");
    linea("T mínima, portante", `T = q·g·l<sub>R</sub>/(8·0,01)`, "TsupMin", qs * g * d.lsup / 0.08, 2, "N");
    linea("T mínima, retorno", `T = q·g·l<sub>R</sub>/(8·0,01)`, "TinfMin", d.qb * g * d.linf / 0.08, 2, "N");
  } else if (ej.tipo === "capas") {
    let z = d.zmin;
    while (z < 60 && d.R * z * d.B / coeficienteSeguridad(z, tablas) < d.Tmax) z++;
    const S = coeficienteSeguridad(z, tablas);
    linea("Capas teóricas", `z ≥ S·T<sub>máx</sub>/(R·B) = ${S} · ${num(d.Tmax, 0)} / (${num(d.R, 0)} · ${num(d.B, 0)})`, "zTeorico", S * d.Tmax / (d.R * d.B), 3);
    linea("Capas adoptadas", "Entero superior, con S coherente con z", "z", z, 0);
    linea("Tensión admisible", `T<sub>adm</sub> = R·z·B/S = ${num(d.R, 0)} · ${z} · ${num(d.B, 0)} / ${S}`, "Tadm", d.R * z * d.B / S, 0, "N");
    linea("Reserva", "T<sub>adm</sub>/T<sub>máx</sub>", "reserva", d.R * z * d.B / S / d.Tmax, 2);
  } else if (ej.tipo === "capacidad") {
    linea("Capacidad", `Q = 3,6·v·S·ρ·k = 3,6 · ${num(d.v, 2)} · ${num(d.S, 3)} · ${num(d.rho, 0)} · ${num(d.k, 2)}`, "Q", 3.6 * d.v * d.S * d.rho * d.k, 2, "t/h");
  } else if (ej.tipo === "seccion") {
    d.casos.forEach((caso, i) => {
      const s = seccionTransversal(caso.B, caso.estacion, caso.lambda, caso.talud, tablas);
      const l3 = caso.l3 !== undefined ? caso.l3 : s.l3;
      const lam = aRad(caso.estacion === 1 ? 0 : caso.lambda);
      const S1 = (l3 + (s.b - l3) * Math.cos(lam)) ** 2 * Math.tan(aRad(caso.talud)) / 6;
      const S2 = (l3 + (s.b - l3) / 2 * Math.cos(lam)) * ((s.b - l3) / 2 * Math.sin(lam));
      linea(`${caso.estacion} rodillo(s), λ = ${num(caso.estacion === 1 ? 0 : caso.lambda, 0)}°: S₁`, `b = ${num(s.b, 3)} m, l₃ = ${num(l3, 3)} m`, `S1_${i + 1}`, S1, 5, "m²");
      linea("S₂", "(l₃ + (b − l₃)/2·cos λ)·((b − l₃)/2·sen λ)", `S2_${i + 1}`, S2, 5, "m²");
      linea("S", "S₁ + S₂", `S_${i + 1}`, S1 + S2, 5, "m²");
    });
  } else if (ej.tipo === "potencia") {
    const Pu = d.Ft * d.v;
    linea("Potencia útil", `P = F<sub>t</sub>·v = ${num(d.Ft, 0)} · ${num(d.v, 2)}`, "Pu", Pu, 1, "W");
    linea("Potencia del motor", `P/η = ${num(Pu, 0)} / ${num(d.eta, 2)}`, "Pm", Pu / d.eta, 1, "W");
    linea("Velocidad angular", `ω = v/r = ${num(d.v, 2)} / ${num(d.r, 3)}`, "omega", d.v / d.r, 2, "rad/s");
    linea("Giro", "n = 60·ω/(2π)", "n", d.v / d.r * 60 / (2 * Math.PI), 1, "rpm");
  } else if (ej.tipo === "tension") {
    const Ft = d.P / d.v;
    const k = Math.exp(d.mu * aRad(d.phi));
    linea("Fuerza tangencial", `F<sub>t</sub> = P/v = ${num(d.P, 0)} / ${num(d.v, 2)}`, "Ft", Ft, 0, "N");
    linea("Límite", `e^(μφ) = e^(${num(d.mu, 2)} · ${num(aRad(d.phi), 3)})`, "k", k, 3);
    linea("T₂ mínima", `T₂ = F<sub>t</sub>/(e^μφ − 1) = ${num(Ft, 0)} / (${num(k, 3)} − 1)`, "T2", Ft / (k - 1) / 1000, 2, "kN");
  } else if (ej.tipo === "vano") {
    const q = d.m * g;
    linea("Carga lineal", `q = m·g = ${num(d.m, 0)} · ${num(g, 2)}`, "q", q, 1, "N/m");
    linea("Separación máxima", `l₀ ≤ 8·T·0,01/q = 8 · ${num(d.T, 0)} · 0,01 / ${num(q, 1)}`, "l0", 8 * d.T * 0.01 / q, 3, "m");
  }
  return { lineas, val };
}

// Compara lo calculado con lo publicado. Una errata declarada no cuenta como fallo.
function compararEjercicio(ej, sol) {
  return ej.publicado.map(p => {
    const real = sol.val[p.clave];
    const coincide = Number.isFinite(real) && Math.abs(real - p.valor) <= p.tol;
    return { ...p, real, coincide };
  });
}

// ---------------------------------------------------------------------------
// 4. Interfaz (solo se ejecuta en el navegador)
// ---------------------------------------------------------------------------

if (typeof document !== "undefined") {
  const $ = id => document.getElementById(id);
  const NUMERICOS = ["Q", "qgDato", "rho", "talud", "tamano", "L", "H", "lambda", "B", "v", "qb", "qRO", "qRU", "lsup", "linf", "hmax", "f", "C", "vent", "FNtamb", "FS1", "FS2", "eta", "r", "mu", "thetaDeg", "margen", "T2", "Tsup", "Tinf", "R", "zmin", "FuDato", "TmaxDato"];
  const SELECTORES = ["selB", "selV", "modo", "datoCarga", "categoria", "granulometria", "estacion", "metodoCap", "usoC", "modoT2", "modoLocal"];

  const selectorEjemplo = $("ejemplo");
  const selectorMaterial = $("material");
  const estado = $("estado");
  const canvasGrafica = $("grafica");
  const ctxGrafica = canvasGrafica.getContext("2d");
  const canvasEsquema = $("esquema");
  const ctxEsquema = canvasEsquema.getContext("2d");
  const inputArchivo = $("archivo-json");
  const etiquetaArchivoNombre = $("archivo-nombre");

  // Llena los selectores con los datos disponibles.
  function cargarDatos(nuevos) {
    datos = nuevos;
    selectorMaterial.innerHTML = "";
    datos.materiales.forEach(material => {
      const opcion = document.createElement("option");
      opcion.value = material.id;
      opcion.textContent = material.nombre;
      selectorMaterial.appendChild(opcion);
    });
    selectorMaterial.disabled = false;

    selectorEjemplo.innerHTML = "";
    datos.ejemplos.forEach(ejemplo => {
      const opcion = document.createElement("option");
      opcion.value = ejemplo.id;
      opcion.textContent = ejemplo.nombre;
      selectorEjemplo.appendChild(opcion);
    });
    selectorEjemplo.disabled = false;

    $("selB").innerHTML = '<option value="auto">Automática</option>'
      + datos.bandas.map(fila => `<option value="${fila.B}">${fila.B} mm</option>`).join("");
    $("selV").innerHTML = '<option value="auto">Automática</option>'
      + datos.velocidades.map(v => `<option value="${v}">${num(v, 2)} m/s</option>`).join("");

    pintarEjercicios();
    aplicarEjemplo(datos.ejemplos.some(item => item.id === "inicio") ? "inicio" : datos.ejemplos[0].id);
  }

  // Copia los valores de un ejemplo en los campos.
  function aplicarEjemplo(id) {
    const ejemplo = datos.ejemplos.find(item => item.id === id);
    if (!ejemplo) return;
    selectorEjemplo.value = id;
    $("ejemplo-nota").textContent = ejemplo.nota || "";
    aplicarValores(ejemplo.valores);
    marcarEnunciado(ejemplo.casillas);
  }

  // LED azul: datos de partida del enunciado. Se apaga cuando el usuario edita la casilla.
  function marcarEnunciado(ids) {
    document.querySelectorAll(".led-azul").forEach(nodo => nodo.classList.remove("led-azul"));
    (ids || []).forEach(id => { if ($(id)) $(id).classList.add("led-azul"); });
  }

  function aplicarValores(valores) {
    $("selB").value = "auto";
    $("selV").value = "auto";
    $("FuDato").value = "";
    $("TmaxDato").value = "";
    Object.entries(valores).forEach(([clave, valor]) => {
      if (clave === "material") selectorMaterial.value = valor;
      else if ($(clave)) $(clave).value = valor;
    });
    actualizar();
  }

  // Copia las propiedades del material elegido en sus campos.
  function aplicarMaterial() {
    const material = datos.materiales.find(item => item.id === selectorMaterial.value);
    if (!material) return;
    $("rho").value = material.densidad;
    $("talud").value = material.sobrecarga;
    $("categoria").value = material.categoria;
    if (material.tamano) $("tamano").value = material.tamano;
    if (material.granulometria) $("granulometria").value = material.granulometria;
    actualizar();
  }

  function leerEntrada() {
    const e = {};
    NUMERICOS.forEach(id => { e[id] = $(id).value === "" ? NaN : Number($(id).value); });
    SELECTORES.forEach(id => { e[id] = $(id).value; });
    e.estacion = Number(e.estacion);
    e.fijoB = e.modo === "dimensionar" && e.selB !== "auto" ? Number(e.selB) : null;
    e.fijoV = e.modo === "dimensionar" && e.selV !== "auto" ? Number(e.selV) : null;
    return e;
  }

  let lambdaGuardado = 35;

  // Muestra solo los campos que hacen falta en cada caso.
  function ajustarCampos(e) {
    const conCarga = e.modo === "dimensionar" || e.datoCarga === "Q";
    const mostrar = (selector, visible) => document.querySelectorAll(selector).forEach(nodo => nodo.classList.toggle("oculto", !visible));
    mostrar(".solo-comprobar", e.modo === "comprobar");
    mostrar(".solo-dimensionar", e.modo === "dimensionar");
    mostrar(".con-Q", conCarga);
    mostrar(".con-qg", !conCarga);
    mostrar(".con-largo", e.L > 80 || !Number.isFinite(e.L));
    mostrar(".con-corto", e.L <= 80);
    if (e.L > 80 && e.usoC !== "manual") mostrar(".con-Cmanual", false);
    mostrar(".con-T2auto", e.modoT2 === "auto");
    mostrar(".con-T2manual", e.modoT2 === "manual");
    mostrar(".con-localmanual", e.modoLocal === "manual");
    // λ coherente con la estación: plana, λ = 0; tablas con 2 rodillos, solo λ = 20°.
    const campoLambda = $("lambda");
    const conTablas = (e.modo === "dimensionar" || e.datoCarga === "Q") && e.metodoCap === "volumetrico";
    const lambdaFijo = e.estacion === 1 ? 0 : (e.estacion === 2 && conTablas ? 20 : null);
    if (lambdaFijo !== null) {
      if (!campoLambda.disabled && e.lambda > 0) lambdaGuardado = e.lambda;
      campoLambda.value = lambdaFijo;
      campoLambda.disabled = true;
      e.lambda = lambdaFijo;
    } else {
      if (campoLambda.disabled) {
        campoLambda.value = lambdaGuardado;
        e.lambda = lambdaGuardado;
      }
      campoLambda.disabled = false;
    }
    $("lambda-ayuda").textContent = e.estacion === 1
      ? "Plana: λ = 0°, l₃ = 0 y S₂ = 0."
      : (lambdaFijo === 20 ? "Las tablas de Rulmeca con 2 rodillos solo dan λ = 20°." : (Number(campoLambda.value) === 0 ? "λ = 0°: rodillos alineados, banda plana y S₂ = 0." : (e.estacion === 2 ? "En V: l₃ = 0." : "En artesa: l₃ según la tabla de rodillos.")));
    $("modo-ayuda").textContent = e.modo === "dimensionar"
      ? "Elige la banda más estrecha y la velocidad normalizada más baja que dan la capacidad."
      : "Comprueba una cinta con la banda y la velocidad que indiques.";
  }

  // 5. Recalcula y pinta todo.
  function actualizar() {
    const e = leerEntrada();
    ajustarCampos(e);

    document.querySelectorAll("input.invalido").forEach(nodo => nodo.classList.remove("invalido"));
    document.querySelectorAll(".led-rojo").forEach(nodo => nodo.classList.remove("led-rojo"));
    const errores = validar(e);
    if (errores.length > 0) {
      errores.forEach(error => $(error.id).classList.add("invalido"));
      estado.innerHTML = errores.map(error => error.texto).join("<br>");
      limpiarResultados("Revisa los datos marcados en rojo para ver el resultado.");
      if (typeof Vista3D !== "undefined" && Vista3D.aviso) Vista3D.aviso("Datos no válidos: el 3D muestra la última cinta válida.");
      return;
    }
    estado.innerHTML = "";

    const r = calcular(e, datos);
    pintarPasos(r);
    pintarListas(r);
    pintarConsejos(e, r);

    if (r.error) {
      limpiarCifras();
      if (typeof Vista3D !== "undefined" && Vista3D.aviso) Vista3D.aviso("Sin solución: el 3D muestra la última cinta válida.");
      $("veredicto").className = "veredicto mal";
      $("veredicto").innerHTML = r.error;
      ctxGrafica.clearRect(0, 0, canvasGrafica.width, canvasGrafica.height);
      ctxEsquema.clearRect(0, 0, canvasEsquema.width, canvasEsquema.height);
      return;
    }

    const todoBien = r.checks.every(item => item.ok);
    $("veredicto").className = "veredicto " + (todoBien ? "bien" : "mal");
    $("veredicto").textContent = todoBien
      ? "✓ El diseño cumple todas las comprobaciones."
      : `✗ El diseño no cumple ${r.checks.filter(item => !item.ok).length} comprobación(es). Mira la lista.`;

    $("r-banda").textContent = `${num(r.B, 0)} mm · ${num(r.v, 2)} m/s`;
    $("r-fu").textContent = `${num(r.Fu, 2)} N`;
    $("r-pot").textContent = `${num(r.Peje / 1000, 2)} kW`;
    $("r-ten").textContent = `${num(r.T1, 0)} / ${num(r.T2, 0)} N`;
    $("r-capas").textContent = `z = ${r.z} (T adm. ${num(r.Tadm, 0)} N)`;
    $("r-cap").textContent = r.Qcap !== undefined ? `${num(r.Qcap, 1)} t/h` : `${num(r.Q, 1)} t/h (dato)`;
    $("r-sec").textContent = r.seccion ? `${num(r.seccion.S * 10000, 1)} cm²` : "—";
    dibujarSeccion(e, r);
    if (typeof Vista3D !== "undefined") Vista3D.actualizar({ ...e, material: selectorMaterial.value }, r, num);

    actualizarDeslizador(e, r);
    dibujarEsquema(e, r);
    dibujarGrafica(e, r);
  }

  function limpiarCifras() {
    $("bloque-seccion").classList.add("oculto");
    ["r-banda", "r-fu", "r-pot", "r-ten", "r-capas", "r-cap", "r-sec"].forEach(id => { $(id).textContent = "—"; });
  }

  function limpiarResultados(mensaje) {
    limpiarCifras();
    $("veredicto").className = "veredicto mal";
    $("veredicto").textContent = mensaje;
    $("comprobaciones").innerHTML = "";
    $("consejos").innerHTML = "";
    $("consejos").classList.add("oculto");
    $("avisos").innerHTML = "";
    document.querySelector("#pasos tbody").innerHTML = "";
    ctxGrafica.clearRect(0, 0, canvasGrafica.width, canvasGrafica.height);
    ctxEsquema.clearRect(0, 0, canvasEsquema.width, canvasEsquema.height);
  }

  function pintarPasos(r) {
    document.querySelector("#pasos tbody").innerHTML = r.pasos.map(p => p.seccion
      ? `<tr class="seccion"><td colspan="3">${p.seccion}</td></tr>`
      : `<tr><td>${p.nombre}</td><td>${p.formula}</td><td>${p.resultado}</td></tr>`).join("");
  }

  // Consejos de redimensionado: casillas en LED rojo, valores estimados y botón para aplicarlos.
  let consejosActuales = [];
  function pintarConsejos(e, r) {
    consejosActuales = consejosRediseno(e, r, datos);
    consejosActuales.forEach(c => c.campos.forEach(id => { if ($(id)) $(id).classList.add("led-rojo"); }));
    const caja = $("consejos");
    caja.classList.toggle("oculto", consejosActuales.length === 0);
    caja.innerHTML = consejosActuales.length === 0 ? "" : `<h3>Cómo redimensionar</h3>
      <p class="ayuda">Las casillas en rojo son las que conviene cambiar. Basta con una opción por cada problema; los valores son estimaciones y al aplicarlos todo se recalcula.</p>
      ${consejosActuales.map((c, i) => `<div class="consejo"><div><strong>${c.titulo}.</strong> ${c.texto}</div>
        <div class="consejo-botones">${Object.keys(c.aplica).length ? `<button type="button" class="boton-secundario" data-aplicar="${i}">Aplicar</button>` : ""}<button type="button" class="boton-secundario" data-ir-campo="${c.campos[0]}">Ir a la casilla</button></div></div>`).join("")}`;
    caja.querySelectorAll("[data-aplicar]").forEach(boton => boton.addEventListener("click", () => {
      Object.entries(consejosActuales[Number(boton.dataset.aplicar)].aplica).forEach(([id, valor]) => {
        $(id).value = valor;
        $(id).classList.remove("led-azul");
      });
      actualizar();
    }));
    caja.querySelectorAll("[data-ir-campo]").forEach(boton => boton.addEventListener("click", () => {
      const campo = $(boton.dataset.irCampo);
      campo.scrollIntoView({ behavior: "smooth", block: "center" });
      campo.focus({ preventScroll: true });
    }));
  }

  function pintarListas(r) {
    $("comprobaciones").innerHTML = r.checks.map(item =>
      `<li class="${item.ok ? "ok" : "no"}"><span class="marca">${item.ok ? "✓" : "✗"}</span><span>${item.texto}</span></li>`).join("");
    $("avisos").innerHTML = r.avisos.map(texto => `<p>${texto}</p>`).join("");
  }

  // El deslizador de T₂ cubre desde 0 hasta 2,5 veces la tensión mínima de diseño.
  function actualizarDeslizador(e, r) {
    const rango = $("T2rango");
    const maximo = Math.ceil(Math.max(r.T2req * 2.5, r.T2 * 1.25) / 1000) * 1000;
    rango.max = maximo;
    rango.step = maximo > 100000 ? 500 : 50;
    rango.value = r.T2;
    $("T2-max").textContent = `${num(maximo, 0)} N`;
    $("T2-valor").textContent = `${num(r.T2, 0)} N`;
  }

  // 6. Dibujar en Canvas la flecha relativa frente a la tensión local.
  function dibujarGrafica(e, r) {
    const ctx = ctxGrafica;
    const ancho = canvasGrafica.width;
    const alto = canvasGrafica.height;
    const margen = { izq: 77, der: 25, sup: 20, inf: 60 };
    const base = alto - margen.inf;
    const anchoGrafica = ancho - margen.izq - margen.der;
    const altoGrafica = alto - margen.sup - margen.inf;
    const qSup = e.qb + r.qg;
    const factorSup = qSup * datos.g * r.cosDelta * e.lsup / 8 * 100;
    const factorInf = e.qb * datos.g * r.cosDelta * e.linf / 8 * 100;
    const maxT = Math.ceil(Math.max(r.TsupMin, r.TinfMin, r.TsupLocal, r.TinfLocal) * 1.5 / 1000) * 1000;
    const maxH = Math.max(e.hmax * 2, 1);

    const x = valor => margen.izq + (valor / maxT) * anchoGrafica;
    const y = valor => base - (valor / maxH) * altoGrafica;

    ctx.clearRect(0, 0, ancho, alto);
    ctx.font = "13px Arial";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const tEje = i * maxT / 4;
      const hEje = i * maxH / 4;
      ctx.strokeStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.moveTo(x(tEje), margen.sup);
      ctx.lineTo(x(tEje), base);
      ctx.moveTo(margen.izq, y(hEje));
      ctx.lineTo(ancho - margen.der, y(hEje));
      ctx.stroke();

      ctx.fillStyle = "#475569";
      ctx.textAlign = "center";
      ctx.fillText(num(tEje, 0), x(tEje), base + 22);
      ctx.textAlign = "right";
      ctx.fillText(num(hEje, 2), margen.izq - 12, y(hEje) + 4);
    }

    ctx.fillStyle = "#334155";
    ctx.textAlign = "center";
    ctx.font = "14px Arial";
    ctx.fillText("Tensión local T (N)", margen.izq + anchoGrafica / 2, alto - 11);
    ctx.save();
    ctx.translate(20, margen.sup + altoGrafica / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Flecha relativa (%)", 0, 0);
    ctx.restore();

    // Curvas h_rel = factor / T, recortadas al área del gráfico.
    const curva = (factor, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      const inicio = Math.max(factor / maxH, maxT / 400);
      for (let i = 0; i <= 200; i++) {
        const t = inicio + (maxT - inicio) * i / 200;
        if (i === 0) ctx.moveTo(x(t), y(factor / t));
        else ctx.lineTo(x(t), y(factor / t));
      }
      ctx.stroke();
    };
    curva(factorSup, "#2563eb");
    curva(factorInf, "#16a34a");

    // Límite de flecha.
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.moveTo(margen.izq, y(e.hmax));
    ctx.lineTo(ancho - margen.der, y(e.hmax));
    ctx.stroke();
    ctx.setLineDash([]);

    // Nombre de cada curva, límite y tensiones mínimas.
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "right";
    const xNombre = maxT * 0.985;
    ctx.fillStyle = "#1d4ed8";
    ctx.fillText("Ramal portante (banda + material)", x(xNombre), y(factorSup / (xNombre - 230 / anchoGrafica * maxT)) - 6);
    ctx.fillStyle = "#15803d";
    ctx.fillText("Ramal de retorno (solo banda)", x(xNombre), y(factorInf / xNombre) + 18);
    ctx.fillStyle = "#dc2626";
    ctx.fillText(`Flecha máxima = ${num(e.hmax, 2)} %`, x(xNombre), y(e.hmax) - 6);

    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.setLineDash([3, 4]);
    ctx.lineWidth = 1;
    [[r.TsupMin, "#1d4ed8", "T mín"], [r.TinfMin, "#15803d", "T mín"]].forEach(([t, color, nombre]) => {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x(t), y(e.hmax));
      ctx.lineTo(x(t), base);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.fillText(`${nombre} = ${num(t, 0)} N`, x(t), base - 7);
    });
    ctx.setLineDash([]);

    // Puntos rojos del estado actual, con su valor.
    if (r.relSup !== undefined) {
      [[r.TsupLocal, r.relSup * 100, "#1d4ed8"], [r.TinfLocal, r.relInf * 100, "#15803d"]].forEach(([t, h, color]) => {
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.arc(x(t), y(Math.min(h, maxH)), 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`${num(t, 0)} N · ${num(h, 2)} %`, x(t) + 10, y(Math.min(h, maxH)) - 9);
      });
    }
  }

  function flechaDibujo(ctx, x1, y1, x2, y2, color) {
    const angulo = Math.atan2(y2 - y1, x2 - x1);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 11 * Math.cos(angulo - 0.45), y2 - 11 * Math.sin(angulo - 0.45));
    ctx.lineTo(x2 - 11 * Math.cos(angulo + 0.45), y2 - 11 * Math.sin(angulo + 0.45));
    ctx.closePath();
    ctx.fill();
  }

  // 7. Esquema de la cinta, con el tambor motriz en la descarga.
  function dibujarEsquema(e, r) {
    const ctx = ctxEsquema;
    const ancho = canvasEsquema.width;
    const alto = canvasEsquema.height;
    ctx.clearRect(0, 0, ancho, alto);

    // La pendiente se exagera para que se vea, con un límite para que quepa.
    const R = 26;
    const pendiente = Math.max(-1, Math.min(1, Math.sign(e.H) * Math.max(Math.abs(e.H / e.L) * 4, e.H === 0 ? 0 : 0.12))) * 70;
    const cola = { x: 90, y: alto / 2 + 15 + pendiente / 2 };
    const cabeza = { x: ancho - 110, y: alto / 2 + 15 - pendiente / 2 };

    const ramal = (dy, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cola.x, cola.y + dy);
      ctx.lineTo(cabeza.x, cabeza.y + dy);
      ctx.stroke();
    };
    ramal(-R, "#dc2626");
    ramal(R, "#2563eb");

    // Tambores.
    [cola, cabeza].forEach((c, i) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, R, 0, 2 * Math.PI);
      ctx.fillStyle = i === 1 ? "#1e293b" : "#94a3b8";
      ctx.fill();
    });

    const punto = (t, dy) => ({ x: cola.x + (cabeza.x - cola.x) * t, y: cola.y + (cabeza.y - cola.y) * t + dy });
    const a = punto(0.45, -R);
    const b = punto(0.5, -R);
    flechaDibujo(ctx, a.x, a.y, b.x, b.y, "#dc2626");
    const c = punto(0.55, R);
    const d = punto(0.5, R);
    flechaDibujo(ctx, c.x, c.y, d.x, d.y, "#2563eb");

    // Material sobre el ramal portante.
    ctx.fillStyle = "#94a3b8";
    for (let i = 1; i < 12; i++) {
      const p = punto(i / 12, -R - 7);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.font = "bold 14px Arial";
    ctx.textAlign = "right";
    ctx.fillStyle = "#b91c1c";
    ctx.fillText(`T₁ = ${num(r.T1, 0)} N`, cabeza.x - 34, cabeza.y - R - 26);
    ctx.fillStyle = "#1d4ed8";
    ctx.fillText(`T₂ = ${num(r.T2, 0)} N`, cabeza.x - 34, cabeza.y + R + 26);

    ctx.textAlign = "left";
    ctx.fillStyle = "#334155";
    if (r.Tcola !== null) ctx.fillText(`T cola = ${num(r.Tcola, 0)} N`, cola.x - 40, cola.y + R + 34);
    else {
      ctx.font = "13px Arial";
      ctx.fillText(`T locales adoptadas: ${num(r.TsupLocal, 0)} y ${num(r.TinfLocal, 0)} N`, cola.x - 40, cola.y + R + 34);
    }

    ctx.font = "13px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#334155";
    ctx.fillText("Motriz", cabeza.x + 8, cabeza.y + R + 20);
    ctx.fillText("Cola", cola.x, cola.y - R - 26);
    ctx.fillText(`L = ${num(e.L, 1)} m · H = ${num(e.H, 1)} m · δ = ${num(r.deltaDeg, 2)}° (pendiente exagerada)`, ancho / 2, 20);
    ctx.fillText(`Fu = T₁ − T₂ =${num(r.Fu, 0)} N`, ancho / 2, alto - 10);
  }

  $("imprimir").addEventListener("click", () => window.print());

  // Sección transversal a escala.
  function dibujarSeccion(e, r) {
    const bloque = $("bloque-seccion");
    bloque.classList.toggle("oculto", !r.seccion);
    if (!r.seccion) return;
    const ctx = $("seccion").getContext("2d");
    const ancho = $("seccion").width;
    const alto = $("seccion").height;
    ctx.clearRect(0, 0, ancho, alto);

    const s = r.seccion;
    const BM = r.B / 1000;
    const lam = e.estacion === 1 ? 0 : aRad(e.lambda);
    const talud = aRad(e.talud);
    const w = s.l3 + (s.b - s.l3) * Math.cos(lam);
    const lado = (s.b - s.l3) / 2;
    const ladoBanda = (BM - s.l3) / 2;
    const flecha = w * Math.tan(talud) / 4;
    const altoTotal = lado * Math.sin(lam) + flecha;
    const escala = Math.min((ancho * 0.8) / BM, (alto * 0.62) / Math.max(altoTotal, ladoBanda * Math.sin(lam), 0.01));
    const cx = ancho / 2;
    const cy = alto - 85;
    const P = (y, z) => ({ x: cx + y * escala, y: cy - z * escala });

    const a = P(-w / 2, lado * Math.sin(lam));
    const d = P(w / 2, lado * Math.sin(lam));
    const b1 = P(-s.l3 / 2, 0);
    const c1 = P(s.l3 / 2, 0);
    const borde = lado * Math.sin(lam);

    if (s.S2 > 0) {
      ctx.fillStyle = "#86efac";
      ctx.strokeStyle = "#15803d";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      [a, b1, c1, d].forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    const control = P(0, borde + 2 * flecha);
    ctx.fillStyle = "#fde047";
    ctx.strokeStyle = "#ca8a04";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(control.x, control.y, d.x, d.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rodillos.
    const rodillo = (p, q) => {
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + 11);
      ctx.lineTo(q.x, q.y + 11);
      ctx.stroke();
    };
    const be = P(-s.l3 / 2 - ladoBanda * Math.cos(lam), ladoBanda * Math.sin(lam));
    const bd = P(s.l3 / 2 + ladoBanda * Math.cos(lam), ladoBanda * Math.sin(lam));
    if (e.estacion === 3) rodillo(b1, c1);
    if (e.estacion === 1) rodillo(P(-BM / 2, 0), P(BM / 2, 0));
    else {
      rodillo(be, b1);
      rodillo(c1, bd);
    }

    // Banda.
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(be.x, be.y);
    ctx.lineTo(b1.x, b1.y);
    ctx.lineTo(c1.x, c1.y);
    ctx.lineTo(bd.x, bd.y);
    ctx.stroke();

    // Cotas y rótulos.
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#713f12";
    ctx.fillText(`S₁ = ${num(s.S1 * 10000, 1)} cm²`, cx, a.y - flecha * escala * 0.25 - 4);
    if (s.S2 > 0) {
      ctx.fillStyle = "#14532d";
      ctx.fillText(`S₂ = ${num(s.S2 * 10000, 1)} cm²`, cx, (a.y + b1.y) / 2 + 5);
    }
    ctx.fillStyle = "#334155";
    ctx.fillText(`B = ${num(r.B, 0)} mm · b = ${num(s.b * 1000, 0)} mm · l₃ = ${num(s.l3 * 1000, 0)} mm · w = ${num(w * 1000, 0)} mm`, cx, alto - 34);
    ctx.fillText(`λ = ${num(e.estacion === 1 ? 0 : e.lambda, 0)}° · θ = ${num(e.talud, 0)}° · S = ${num(s.S * 10000, 1)} cm²`, cx, alto - 14);
  }

  // Lista de ejercicios resueltos con la comparación frente a lo publicado.
  function pintarEjercicios() {
    let correctos = 0;
    let erratas = 0;
    let total = 0;
    $("ejercicios").innerHTML = datos.ejercicios.map(ej => {
      const sol = resolverEjercicio(ej, datos);
      const filas = compararEjercicio(ej, sol).map(p => {
        total++;
        if (p.coincide) correctos++;
        else if (p.errata) erratas++;
        const marca = p.coincide ? '<span class="coincide">✓ Coincide</span>' : (p.errata ? '<span class="errata">⚠ Errata de la fuente</span>' : '<span class="errata">✗ Revisar</span>');
        const dec = p.dec === undefined ? 2 : p.dec;
        return `<tr><td>${p.nombre}</td><td>${num(p.valor, dec)}</td><td>${num(p.real, dec)}</td><td>${marca}</td></tr>`;
      }).join("");
      const desarrollo = sol.lineas.map(l => l.seccion
        ? `<tr class="seccion"><td colspan="3">${l.seccion}</td></tr>`
        : `<tr><td>${l.nombre}</td><td>${l.formula}</td><td>${l.resultado}</td></tr>`).join("");
      return `<details class="ejercicio" data-ejercicio="${ej.id}"><summary>${ej.titulo} <span class="fuente">· ${ej.fuente}</span></summary><div class="cuerpo">
        <p>${ej.enunciado}</p>
        ${ej.nota ? `<p class="nota-ej">${ej.nota}</p>` : ""}
        <div class="tabla-envoltura"><table><thead><tr><th>Magnitud</th><th>Publicado</th><th>Esta app</th><th>Estado</th></tr></thead><tbody>${filas}</tbody></table></div>
        <h3>Desarrollo</h3>
        <div class="tabla-envoltura"><table class="desarrollo"><thead><tr><th>Magnitud</th><th>Fórmula y sustitución</th><th>Resultado</th></tr></thead><tbody>${desarrollo}</tbody></table></div>
        <p class="datos-cargados">✓ Datos del enunciado cargados en la calculadora.${ej.notaCarga ? " " + ej.notaCarga : ""}</p>
        <button type="button" class="boton-secundario" data-ir>Ir a la calculadora</button>
      </div></details>`;
    }).join("");
    $("ejercicios-resumen").textContent = `${datos.ejercicios.length} ejercicios · ${correctos} de ${total} valores coinciden · ${erratas} erratas de las fuentes, explicadas en cada ejercicio.`;
    // Al abrir un ejercicio, sus datos de partida pasan a la calculadora.
    document.querySelectorAll("[data-ejercicio]").forEach(detalle => detalle.addEventListener("toggle", () => {
      if (!detalle.open) return;
      document.querySelectorAll("[data-ejercicio]").forEach(otro => { if (otro !== detalle) otro.open = false; });
      const ej = datos.ejercicios.find(item => item.id === detalle.dataset.ejercicio);
      const baseId = ej.datos.base || "apuntes";
      const base = datos.ejemplos.find(item => item.id === baseId).valores;
      selectorEjemplo.selectedIndex = -1;
      $("ejemplo-nota").textContent = `Cargado: ${ej.titulo}.`;
      aplicarValores({ ...base, ...(ej.carga || ej.datos) });
      marcarEnunciado(ej.casillas);
    }));
    document.querySelectorAll("[data-ir]").forEach(boton => boton.addEventListener("click", () => {
      $("controles-titulo").scrollIntoView({ behavior: "smooth" });
    }));
  }

  // Eventos.
  const editado = evento => {
    evento.target.classList.remove("led-azul");
    actualizar();
  };
  NUMERICOS.forEach(id => $(id).addEventListener("input", editado));
  SELECTORES.forEach(id => $(id).addEventListener("change", editado));
  selectorMaterial.addEventListener("change", aplicarMaterial);
  selectorEjemplo.addEventListener("change", () => aplicarEjemplo(selectorEjemplo.value));
  $("T2rango").addEventListener("input", () => {
    $("T2").value = $("T2rango").value;
    actualizar();
  });

  // Soporte para cargar un archivo JSON modificado manualmente desde el explorador de archivos.
  inputArchivo.addEventListener("change", evento => {
    const archivo = evento.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = e => {
      try {
        const nuevos = JSON.parse(e.target.result);
        if (!datosValidos(nuevos)) {
          alert("El archivo JSON debe tener la misma estructura que datos.json.");
          return;
        }
        cargarDatos(nuevos);
        etiquetaArchivoNombre.textContent = `Archivo cargado: ${archivo.name}`;
      } catch (err) {
        alert("Error al leer el archivo JSON: " + err.message);
      }
    };
    lector.readAsText(archivo);
  });

  function datosValidos(d) {
    return d && Array.isArray(d.materiales) && d.materiales.length > 0
      && Array.isArray(d.ejemplos) && d.ejemplos.length > 0
      && Array.isArray(d.bandas) && Array.isArray(d.rodillos) && Array.isArray(d.velocidades)
      && Array.isArray(d.factorK) && Array.isArray(d.coeficienteC) && Array.isArray(d.seguridad)
      && Array.isArray(d.ejercicios)
      && d.factorGranulometria && d.capacidadRulmeca && Number.isFinite(d.g);
  }

  // Cargar datos desde el archivo JSON o usar los integrados si se abre directamente en local (file://).
  async function iniciar() {
    try {
      const respuesta = await fetch("datos.json");
      if (!respuesta.ok) throw new Error("No se pudo leer datos.json");
      const leidos = await respuesta.json();
      if (!datosValidos(leidos)) throw new Error("Formato de datos.json incorrecto");
      cargarDatos(leidos);
    } catch (error) {
      // Si se abre haciendo doble clic (file:///), los navegadores bloquean fetch por política CORS.
      console.info("Aviso: no se pudo leer datos.json (habitual al abrir con doble clic). Usando los datos integrados.", error);
      cargarDatos(DATOS_POR_DEFECTO);
    }
  }

  iniciar();
}

// Permite probar los cálculos desde Node sin navegador.
if (typeof module !== "undefined") {
  module.exports = { consejosRediseno, resolverEjercicio, compararEjercicio, calcular, validar, seccionTransversal, caudalTabla, interpolar, coeficienteSeguridad, DATOS_POR_DEFECTO };
}
