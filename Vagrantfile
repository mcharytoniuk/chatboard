Vagrant.configure(2) do |config|
    config.vm.box = "ubuntu/vivid64"

    config.vm.network "forwarded_port", guest: 27017, host: 27017
    config.vm.network "forwarded_port", guest: 6379, host: 6379

    config.vm.provision :docker
    config.vm.provision :shell, inline: <<-SHELL
        sudo apt-get update;
        sudo apt-get install -y python-pip;
        sudo pip install -U docker-compose;
        cd /vagrant;
        sudo docker-compose up;
    SHELL
end
