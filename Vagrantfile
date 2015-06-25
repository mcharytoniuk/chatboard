Vagrant.configure(2) do |config|
    config.vm.box = "ubuntu/vivid64"

    config.vm.network "forwarded_port", guest: 27017, host: 27017
    config.vm.network "forwarded_port", guest: 6379, host: 6379

    config.vm.provision :docker
    config.vm.provision :shell, inline: <<-SHELL
        if [ -z "$( which docker-compose )" ] ; then
            apt-get update;
            apt-get install -y python-pip;
            pip install -U docker-compose;
        fi

        cd /vagrant;
        docker-compose up;
    SHELL
end
