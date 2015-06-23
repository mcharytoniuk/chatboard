Vagrant.configure(2) do |config|
    config.vm.box = "ubuntu/vivid64"

    config.vm.network "forwarded_port", guest: 27017, host: 27017
    config.vm.network "forwarded_port", guest: 6379, host: 6379

    config.vm.provision "shell", inline: <<-SHELL
        apt-get -y install mongodb-server redis-server;
        service mongodb restart;
        service redis stop;
        service redis start;
    SHELL
end
