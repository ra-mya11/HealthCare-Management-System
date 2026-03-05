package com.healthcare.medicalrecords.service;

import io.ipfs.api.IPFS;
import io.ipfs.api.MerkleNode;
import io.ipfs.api.NamedStreamable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class IPFSService {
    
    private final IPFS ipfs;
    
    public IPFSService(@Value("${ipfs.host}") String host, 
                       @Value("${ipfs.port}") int port) {
        this.ipfs = new IPFS(host, port);
    }
    
    public String uploadFile(MultipartFile file) throws Exception {
        NamedStreamable.ByteArrayWrapper fileWrapper = 
            new NamedStreamable.ByteArrayWrapper(file.getOriginalFilename(), file.getBytes());
        MerkleNode response = ipfs.add(fileWrapper).get(0);
        return response.hash.toString();
    }
    
    public byte[] downloadFile(String hash) throws Exception {
        return ipfs.cat(io.ipfs.multihash.Multihash.fromBase58(hash));
    }
}
