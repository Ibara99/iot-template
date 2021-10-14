
# Dokumentasi Pengembangan Tugas Akhir S1

##catatan penulis
manipulasi salinitas dimuali 03/09/21 jam 9am.  dan baru dan baru ditambah salinitasnya (menggunakan garam dapur jam 10am.

## Overview Repositori
Sebuah Repositori untuk tracking progress tugas akhir serta sekalian untuk portofolio. Projek tugas akhir ini dilakukan bersama 2 teman saya, dengan inisial C dan F. Bersama 2 dosen pembimbing, Pak Mulaab dan Pak Dwi Kuswanto.

Topik tugas akhir ini adalah Internet of Things pada Tambak Udang Vaname. Beberapa Setting yang dipakai pada projek ini di antaranya adalah :

1. Menggunakan MQTT, dengan service broker Mosquito
2. Menggunakan MongoDB, dengan service AtlasDB
3. Server menggunakan ExpressJS
4. Template tampilan sebagian besar memanfaatkan AdminLTE dengan pengubahan secukupnya

## Direktori projek
Beberapa penjelasan direktori pada projek ini.

### index.js
File main program

### ./kode_arduino
Direktori berisi file untuk dirunning pada mikrokontroller. Back-up jika sewaktu-waktu butuh/dipertanyakan.

### ./model
direktori berisi model database

### ./plugins
direktori berisi perhitungan dan algoritma dalam analisis

### ./public
direktori berisi file yang dapat diakses dari luar

### ./routes
direktori berisi rute rute yang ada pada server. Rute pada server ini dipisahkan menjadi 2 bagian; User interface yang diatur pada file ```sensor.js``` dan API interface yang digunakan untuk kepentingan sensor dan lain sebagainya yang diatur pada file ```api.js```

### ./servers
direktori yang berisi setup awal server. Seperti setup koneksi http, mqtt, dan websocket. Semua modul ini akan dipanggil dan digunakan pada ```index.js```

### src_readme
direktori yang berisi file-file yang diperlukan untuk dipanggil pada readme.md. Direktori ini berguna untuk menyimpan gambar yang akan dipakai pada readme di github

### views
direktori yang berisi view User Interface yang akan digunakan pada server.

## Yang bisa dilakukan website ini
Website ini bisa melakukan beberapa hal seperti:

1. Monitoring kualitas air pada tambak, khususnya pH dan  salinitas air.
  
  1.1. pada menu ```home```, menampilkan 3 jam terakhir.

  1.2. pada menu ```data```, user dapat mencari detail data pada kurun waktu yang diinginkan.

2. Apabila user telah login, user dapat:
  
  2.1. melihat anomali pada tambak pada menu ```Analisis Data > Deteksi anomali```
  
  2.2. melihat prediksi kualitas air pada tambak pada menu ```Analisis Data > Peramalan Data``` (dalam tahap pengembangan)

## Rute API
Rute api dapat diakses menggunakan ```./api```. Beberapa rute yang bisa diakses adalah sebagai berikut:

### GET ./api
Rute ini digunakan untuk mendapatkan semua data yang terdapat pada database. Terdapat beberapa parameter opsional yang dapat digunakan untuk mem-filter hasil.

* *from*: tanggal awal pencarian, dengan format datetime UTC (YYYY-MM-dd HH-mm-ss). Parameter ini digunakan bersama dengan *to*.
* *to*: tanggal akhir pencarian, dengan format datetime UTC (YYYY-MM-dd HH-mm-ss). Parameter ini digunakan bersama dengan *from*
* *limit*: banyak data yang ditampilkan. Data yang diambil berdasarkan data terbaru.
* *outlier*: hanya menampilkan data dengan outlier atau tidak. Format true/false

### GET ./api/elbow
Rute ini digunakan untuk mengolah data menggunakan *metode elbow*. Hal ini bertujuan untuk menghitung nilai cost pada setiap jumlah patisi cluster. Rute ini menggunakan 2 parameter wajib, yaitu:

* **from*: tanggal awal pencarian, dengan format datetime UTC (YYYY-MM-dd HH-mm-ss). Merupakan parameter __wajib__.
* **to*: tanggal akhir pencarian, dengan format datetime UTC (YYYY-MM-dd HH-mm-ss). Merupakan parameter __wajib__.

### GET ./api/deteksianomali
Rute ini digunakan untuk mendeteksi anomali menggunakan K-Means Clustering. Terdapat 2 parameter wajib dan 1 parameter opsional pada rute ini, yaitu:

* **from*: tanggal awal pencarian, dengan format datetime UTC (YYYY-MM-dd HH-mm-ss). Merupakan parameter __wajib__.
* **to*: tanggal akhir pencarian, dengan format datetime UTC (YYYY-MM-dd HH-mm-ss). Merupakan parameter __wajib__.
* *k*: banyak partisi cluster. Secara default, k=3.