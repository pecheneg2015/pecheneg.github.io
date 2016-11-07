clear all;
n=10;
n0=5;


t=0:.1:30;
a=1+1/(2*n0);

% %Генерируем передаточные функции. Начало
syms p
for i=1:n
    num=a^(i-1);
    denum=double(coeffs((p+1)^i));
    trF(i)=tf(num,denum);
end
% %Генерируем передаточные функции. Конец
% 
% %Строим графики реакции на дельта импульс. Начало.
figure();hold on;
for i=1:n
    impulse(trF(i),t)
end
set(findall(gcf,'Type','line'),'LineWidth',1);
grid;
% %Строим графики реакции на дельта импульс. Конец.
% 
% %Строим графики реакции на единичный скачок. Начало.
figure();hold on;
for i=1:n
    step(trF(i),t)
end
set(findall(gcf,'Type','line'),'LineWidth',1);
grid;
% %Строим графики реакции на единичный скачок. Конец.

figure();hold on;grid;
for i=0:n
    plot(t,1/factorial(i)*(a.*t).^i.*exp(-t),'LineWidth',1)
end


