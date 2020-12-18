import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [msg, setMsg] = useState('');
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    if (uploadedFiles.length === 0) {
      setMsg('Selecionar arquivo antes de enviar');
      return;
    }
    const data = new FormData();

    data.append('file', uploadedFiles[0].file);

    try {
      await api.post('/transactions/import', data);
      setUploadedFiles([]);
      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    setUploadedFiles([
      {
        file: files[0],
        name: files[0].name,
        readableSize: filesize(files[0].size),
      },
    ]);
    setMsg('');
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <p>{msg}</p>

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
