# Datos de la Lección 1

Estos son extractos de los módulos oficiales de la Encuesta Nacional de Hogares 2023 del INEI. Cada extracto conserva todas las filas del CSV original y selecciona únicamente las columnas que usa la sesión. No hay filtros de observaciones, recodificaciones ni uniones en estos archivos.

| Módulo | Archivo de clase | Unidad | Filas | Columnas | Tamaño |
|---|---|---|---:|---:|---:|
| 200 | `enaho_2023_200_clase.csv` | Persona | 119,747 | 10 | 4.43 MB |
| 300 | `enaho_2023_300_clase.csv` | Persona de 3 años o más | 108,354 | 8 | 3.00 MB |
| 500 | `enaho_2023_500_clase.csv` | Persona de 14 años o más | 86,654 | 11 | 4.23 MB |

Las claves comunes son `AÑO`, `CONGLOME`, `VIVIENDA`, `HOGAR` y `CODPERSO`. El módulo 200 corresponde a Características de los Miembros del Hogar, el 300 a Educación y el 500 a Empleo e Ingresos.

## Procedencia y verificación

Los CSV originales usados para construir esta copia ya estaban almacenados en el archivo docente. Los enlaces siguientes apuntan a los ZIP oficiales del Sistema de Microdatos del INEI. Los hashes permiten verificar tanto los originales como los extractos incluidos aquí.

### Módulo 200

- Descarga oficial: https://proyectos.inei.gob.pe/iinei/srienaho/descarga/CSV/906-Modulo02.zip
- CSV original: `Enaho01-2023-200.csv`
- SHA-256 original: `E51119AB4539BC0F912FB66F2CAEDCF9B569684E677EE343CD1422676DD0D438`
- SHA-256 extracto: `DEDF5AFA76F6B0E06E8EE2342132D35364AC1575836A40AB5F463AD93A7CAE7A`
- Columnas: `AÑO`, `CONGLOME`, `VIVIENDA`, `HOGAR`, `CODPERSO`, `UBIGEO`, `ESTRATO`, `P204`, `P207`, `P208A`

### Módulo 300

- Descarga oficial: https://proyectos.inei.gob.pe/iinei/srienaho/descarga/CSV/906-Modulo03.zip
- CSV original: `Enaho01A-2023-300.csv`
- SHA-256 original: `FECE75134C7271C137F50A5FB00DBEAD8D22741396A9F626FB1C34F9E3891D21`
- SHA-256 extracto: `782036571A534A856D8C1A5A39C95D9E0391F3F60C8011A45BD3D6AA7CD787A3`
- Columnas: `AÑO`, `CONGLOME`, `VIVIENDA`, `HOGAR`, `CODPERSO`, `P301A`, `P301B`, `P301C`

### Módulo 500

- Descarga oficial: https://proyectos.inei.gob.pe/iinei/srienaho/descarga/CSV/906-Modulo05.zip
- CSV original: `Enaho01a-2023-500.csv`
- SHA-256 original: `332A14B2C4AE36C3C2A78E7F15BFD88986D7A9C8BB246EA56B5E99F78CA9EDF8`
- SHA-256 extracto: `884F7DA4B97D65516DE7BA7ACB51B686446CA5AB16B3CE8172A8D80EC90F4B31`
- Columnas: `AÑO`, `CONGLOME`, `VIVIENDA`, `HOGAR`, `CODPERSO`, `P501`, `P507`, `P513T`, `P523`, `P524A1`, `FAC500A`

## Regeneración

Ejecute `python scripts/crear_extractos_enaho.py RUTA_A_LOS_CSV_ORIGINALES` desde la carpeta `01_python`. El script espera los tres nombres originales documentados arriba y vuelve a crear los archivos dentro de `data`.
