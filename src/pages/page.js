import styles from "@/styles/Home.module.css";
import axios from "axios";
import { Kanit } from "next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";

const rubik = Kanit({ weight: "400", subsets: ["latin"] });

const apiUrl = "https://qualquercoisa-aoo1.onrender.com";


export default function Home() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [atualiza, setAtualiza] = useState(false);
  const [loading, setLoading] = useState(false);

  function changeInput(e) {
    setName(e.target.value);
  }

  function include() {
    if (name === "") return alert("Digite um nome!");
    setLoading(true);
    axios
      .post(`${apiUrl}/user`, { nome: name })
      .then((response) => {
        console.log(response.data);
        alert("Usuário cadastrado com sucesso!");
        setAtualiza(!atualiza);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          alert("Nome já cadastrado!");
          setLoading(false);
        }
        if (error.response.status === 500) {
          alert("Erro no servidor!");
          setLoading(false);
        }
      });
  }

  function find() {
    if (name === "") return alert("Digite um nome!");
    setLoading(true);
    axios
      .get(`${apiUrl}/user/${name}`)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Usuário não encontrado!");
        setLoading(false);
      });
  }

  function findAll() {
    setLoading(true);
    axios
      .get(`${apiUrl}/users`)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if(error.response.status===404){
          alert("usuario nao cadastrado!!");
        }
        setLoading(false);
      });
  }

  function edit() {
    if (name === "") return alert("Digite um nome!");
  
    const editEndpoint = `${apiUrl}/user/:id`; 
  
    setLoading(true);

    axios
      .get(`${apiUrl}/user/${name}`)
      .then((response) => {
        const user = response.data[0];
  
        const updatedName = prompt("Enter the new name:", user.nome);
  
        if (updatedName !== null) {
          axios
            .put(editEndpoint.replace(":id", user.id), { nome: updatedName })
            .then(() => {
              alert("Usuário atualizado com sucesso!");
              setAtualiza(!atualiza);
              setLoading(false);
            })
            .catch((error) => {
              console.log(error);
              alert("Erro ao atualizar usuário!");
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Usuário não encontrado!");
        setLoading(false);
      });
  }
  
  function del() {
    if (name === "") return alert("Digite um nome!");
  
    const delEndpoint = `${apiUrl}/user/:id`; 
  
    setLoading(true);
  
    axios
      .get(`${apiUrl}/user/${name}`)
      .then((response) => {
        const user = response.data[0];
  
        const confirmDelete = window.confirm(`Tem certeza que deseja excluir ${user.nome}?`);
  
        if (confirmDelete) {
          axios
            .delete(delEndpoint.replace(":id", user.id))
            .then(() => {
              alert("Usuário excluído com sucesso!");
              setAtualiza(!atualiza);
              setLoading(false);
            })
            .catch((error) => {
              console.log(error);
              alert("Erro ao excluir usuário!");
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Usuário não encontrado!");
        setLoading(false);
      });
  }

  function renderLoading() {
    return <div className={styles.loading}></div>;
  }

  useEffect(() => {
    findAll();
  }, [atualiza]);

  return (
    <>
      {loading ? renderLoading() : null}
      <Head>
        <title>CENÁRIO 3</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.top}>
          <p className={rubik.className}>CENÁRIO 3</p>
        </div>
        <div className={styles.middle}>
          <div className={styles.containerOptions}>
            <form className={styles.form}>
              <input
                maxLength={20}
                className={styles.input}
                type="text"
                placeholder="Nome"
                name="name"
                onChange={changeInput}
              />
            </form>
            <div className={styles.containerButtons}>
              <div className={styles.optionInclude} onClick={include}>
                Cadastrar
              </div>
              <div className={styles.optionFindAll} onClick={findAll}>
                Todos
              </div>
              <div className={styles.optionFind} onClick={find}>
                Buscar
              </div>
              <div className={styles.optionInclude} onClick={edit}>
                Editar
              </div>
              <div className={styles.optionFindAll} onClick={del}>
                Deletar
              </div>
            </div>
          </div>
          <div className={styles.containerItems}>
            <p className={styles.list}>Resultado:</p>
            {users.length > 0 ? (
              users.map((item, index) => (
                <div className={styles.item} key={index}>
                  {item.name}
                </div>
              ))
            ) : (
              <div>Não há usuários cadastrados!</div>
            )}
          </div>
        </div>
        <div className={styles.bottom}>
          <p className={rubik.className}>UFMA - 2023 &copy;</p>
        </div>
      </main>
    </>
  );
}
